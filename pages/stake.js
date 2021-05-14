import React, { useState, useEffect } from 'react';

import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { mdiWalletGiftcard, mdiTrophyAward } from '@mdi/js';

import keys from '../config/keys'
import Text from '../reusable/text'
import Avatar from '../reusable/avatar'
import Card from '../reusable/card'
import Table from '../reusable/table'
import Weight from '../reusable/weight'
import Button from '../reusable/button'
import StakeModal from '../components/liquidity/stake'
import MemberSearch from '../components/modals/member-search'
import EpochSelector from '../components/modals/epoch-selector'
import { useStoreApi } from '../store/provider'
import { getStakesTo, getStakesFrom } from '../api/get'
import { delegateStakes } from '../api/post'
import { format } from '../utils/money'

const Stake = props => {
  const store = useStoreApi()
  const { getMember, getProtocol } = store

  const [epochSelectorOpen, setEpochSelectorOpen] = useState(false)
  const [selectedEpoch, setSelectedEpoch] = useState(getProtocol().epochNumber)
  const [delegationsTo, setDelegationsTo] = useState([])
  const [delegationsFrom, setDelegationsFrom] = useState([])
  const [delegationsToAmount, setDelegationsToAmount] = useState(0)
  const [delegationsFromAmount, setDelegationsFromAmount] = useState(0)
  const [stakeDntOpen, setStakeDntOpen] = useState(false)
  const [showMemberSearch, setShowMemberSearch] = useState(false)

  useEffect(() => {
    getStakeDelegationsTo(0, selectedEpoch)
    getStakeDelegationsFrom(0, selectedEpoch)
  }, [])

  //No pagination on the "To" table
  async function getStakeDelegationsTo(skip, epoch) {
    let data = await getStakesTo({
      params: {
        epoch,
        ethAddress: getMember().ethAddress
      },
      store
    })
    if (!data) return
    let newTable = skip == 0 ? [...data.delegationsTo] : [...delegationsTo, ...data.delegationsTo]
    setDelegationsTo(newTable)
    setDelegationsToAmount(data.delegationsToAmount)
  }

  async function getStakeDelegationsFrom(skip, epoch) {
    let data = await getStakesFrom({
      params: {
        skip,
        epoch,
        ethAddress: getMember().ethAddress
      },
      store
    })
    if (!data) return
    let newTable = skip == 0 ? [...data.delegationsFrom] : [...delegationsFrom, ...data.delegationsFrom]
    setDelegationsFrom(newTable)
    setDelegationsFromAmount(data.delegationsFromAmount)
  }

  async function stakeDelegations() {
    await delegateStakes({
      params: {delegations: delegationsTo},
      store
    })
  }

  function includes(array, cell) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].ethAddress == cell.ethAddress) return true
    }
    return false
  }

  function renderToCell(cell, i) {
    const { classes } = props
    const { alias, weight } = cell

    return <Card className={classes.cell}>
      <span className={classes.profileContainer}>
        <Avatar member={cell} size={40}></Avatar>
        <Text margin="0px 0px 0px 15px" fontSize={20}>{alias}</Text>
      </span>
      <Weight
        disabled={selectedEpoch != getProtocol().epochNumber}
        value={weight}
        onChange={(weight) => {
          let newDelegationsTo = [...delegationsTo]
          let member = { ...newDelegationsTo[i] }
          member.weight = weight
          newDelegationsTo[i] = member
          newDelegationsTo = newDelegationsTo.sort((u1, u2) => {
            u1.weight = u1.weight ? u1.weight : 0
            u2.weight = u2.weight ? u2.weight : 0
            return u1 - u2
          })
          setDelegationsTo(newDelegationsTo)
        }}
      />
    </Card>
  }

  function renderFromCell(cell) {
    const { classes } = props
    const { alias, weight } = cell

    return <Card className={classes.cell}>
      <span className={classes.profileContainer}>
        <Avatar member={cell} size={40}></Avatar>
        <Text margin="0px 0px 0px 15px" fontSize={20}>{alias}</Text>
      </span>
      <Weight
        value={weight}
        disabled
      />
    </Card>
  }

  function renderStakeButton() {
    const { classes } = props
    if (selectedEpoch != getProtocol().epochNumber || delegationsTo.length <= 0) return null
    
    return (
      <span className={classes.buttonContainer}><Button
        gradient
        width={200}
        height={50}
        onClick={() => stakeDelegations()}
      >
        Stake!
      </Button></span>
    )
  }

  const { classes } = props
  return (
    <div className={classes.stake}>
      <div className={classes.epoch}>
        <Button
          onClick={() => setEpochSelectorOpen(true)}
          type="secondary" className={classes.epochButton} margin="0px 20px 0px 0px" width={110}>
          Epoch {selectedEpoch}
        </Button>
        {(selectedEpoch == getProtocol().epochNumber) ? <Button
          onClick={() => setStakeDntOpen(true)}
          gradient className={classes.epochButton} margin="0px 20px 0px 0px" width={110}>
          Stake DNT!
        </Button> : null}
      </div>
      <div className={classes.tables}>
        <div className={classes.left}>
          <span className={classes.textContainer}>
            <Text type="paragraph" fontSize={20} fontWeight={700}>Stake To</Text>
            {(selectedEpoch == getProtocol().epochNumber) ? <AddIcon
              onClick={() => setShowMemberSearch(true)}
              className={classes.icon}
              fontSize="small"
            /> : null}
          </span>
          <span className={classes.textContainer}>
            <Text type="paragraph" fontSize={15} fontWeight={700}>Staked: {format(delegationsToAmount, 2)}</Text>
          </span>
          <Table
            text="You haven't staked anyone"
            list={delegationsTo}
            renderCell={(value, i) => renderToCell(value, i)}
            icon={mdiWalletGiftcard}
            action={(selectedEpoch != getProtocol().epochNumber) ? null : () => {
              setShowMemberSearch(true)
            }}
          />
          {renderStakeButton()}
        </div>
        <div className={classes.right}>
          <span className={classes.textContainer}>
            <Text type="paragraph" fontSize={20} fontWeight={700}>Stake From</Text>
          </span>
          <span className={classes.textContainer}>
            <Text type="paragraph" fontSize={15} fontWeight={700}>Staked: {format(delegationsFromAmount, 2)}</Text>
          </span>
          <Table
            text='No stakes here!'
            list={delegationsFrom}
            renderCell={value => renderFromCell(value)}
            icon={mdiTrophyAward}
            onScroll={async () => {
              await getStakeDelegationsFrom(delegationsFrom.length, selectedEpoch)
            }}
          />
        </div>
      </div>
      <StakeModal
        open={stakeDntOpen}
        close={() => setStakeDntOpen(false)}
        title="Stake Your DNT"
        label="Stake DNT"
        buttonLabel="Stake"
      />
      <MemberSearch
        selected={delegationsTo}
        open={showMemberSearch}
        close={() => setShowMemberSearch(false)}
        title={'Choose people to stake'}
        action={(selected) => {
          let newSelected = [...delegationsTo]
          for (let i = 0; i < selected.length; i ++) {
            if (selected[i].weight == undefined) selected[i].weight = 0
            if (!includes(newSelected, selected[i])) {
              newSelected.push(selected[i])
            }
          }
          setDelegationsTo(newSelected)
          setShowMemberSearch(false)
        }}
      />
      <EpochSelector
        open={epochSelectorOpen}
        close={() => setEpochSelectorOpen(false)}
        title={'Select epoch'}
        action={(selected) => {
          setSelectedEpoch(selected)
          getStakeDelegationsTo(0, selected)
          getStakeDelegationsFrom(0, selected)
          setEpochSelectorOpen(false)
        }}
      />
    </div>
  )
}

const useStyles = theme => ({
  stake: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'hidden',
    padding: '30px 200px',
    // height: '80vh'
  },
  epoch: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    marginBottom: 25,
    marginLeft: 15,
    width: '100%'
  },
  epochButton: {
    fontWeight: 700,
    fontSize: 15,
    padding: '8px 10px'
  },
  tables: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 20px',
    height: '72vh'
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 20px',
    height: '72vh'
  },
  cell: {
    marginBottom: 20,
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: '0.2s',
    cursor: 'pointer',
    padding: '17px 20px',
    '&:hover': {
      opacity: 0.8,
      transition: '0.2s'
    }
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  icon: {
    color: keys.WHITE,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7
    }
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: "center",
    marginTop: 28
  }
});

export default withStyles(useStyles)(Stake);