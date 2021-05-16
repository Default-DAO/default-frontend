import React, { useState, useEffect } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { mdiWalletGiftcard, mdiTrophyAward } from '@mdi/js';

import keys from '../../config/keys'
import Text from '../../reusable/text'
import Avatar from '../../reusable/avatar'
import Card from '../../reusable/card'
import Table from '../../reusable/table'
import Weight from '../../reusable/weight'
import { useStoreApi } from '../../store/provider'
import { getStakesTo, getStakesFrom } from '../../api/get'
import { format } from '../../utils/money'

const ProfileStakes = props => {
  const {ethAddress, selectedEpoch} = props
  const store = useStoreApi()

  const [delegationsTo, setDelegationsTo] = useState([])
  const [delegationsFrom, setDelegationsFrom] = useState([])
  const [delegationsToAmount, setDelegationsToAmount] = useState(0)
  const [delegationsFromAmount, setDelegationsFromAmount] = useState(0)

  useEffect(() => {
    getStakeDelegationsTo(0, selectedEpoch)
    getStakeDelegationsFrom(0, selectedEpoch)
  }, [selectedEpoch])

  //No pagination on the "To" table
  async function getStakeDelegationsTo(skip, epoch) {
    let data = await getStakesTo({
      params: {
        epoch,
        ethAddress: ethAddress
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
        ethAddress: ethAddress
      },
      store
    })
    if (!data) return
    let newTable = skip == 0 ? [...data.delegationsFrom] : [...delegationsFrom, ...data.delegationsFrom]
    setDelegationsFrom(newTable)
    setDelegationsFromAmount(data.delegationsFromAmount)
  }

  function renderCell(cell) {
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

  const { classes } = props
  return (
    <div className={classes.stake}>
      <div className={classes.tables}>
        <div className={classes.left}>
          <span className={classes.textContainer}>
            <Text type="paragraph" fontSize={15} fontWeight={700}>Stake To</Text>
          </span>
          <span className={classes.textContainer}>
            <Text type="paragraph" fontSize={12} fontWeight={700}>Staked: {format(delegationsToAmount, 2)}</Text>
          </span>
          <Table
            className={classes.table}
            text="No stakes sent"
            list={delegationsTo}
            renderCell={(value, i) => renderCell(value, i)}
            icon={mdiWalletGiftcard}
          />
        </div>
        <div className={classes.right}>
          <span className={classes.textContainer}>
            <Text type="paragraph" fontSize={15} fontWeight={700}>Stake From</Text>
          </span>
          <span className={classes.textContainer}>
            <Text type="paragraph" fontSize={12} fontWeight={700}>Staked: {format(delegationsFromAmount, 2)}</Text>
          </span>
          <Table
            className={classes.table}
            text='No stakes received'
            list={delegationsFrom}
            renderCell={value => renderCell(value)}
            icon={mdiTrophyAward}
            onScroll={async () => {
              await getStakeDelegationsFrom(delegationsFrom.length, selectedEpoch)
            }}
          />
        </div>
      </div>
    </div>
  )
}

const useStyles = theme => ({
  stake: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  tables: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
  },
  table: {
    height: '100%',
    width: 350
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 20px'
  },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 20px',
    // height: '72vh'
  },
  cell: {
    marginBottom: 20,
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: '0.2s',    
    padding: '14px 20px',
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
  }
});

export default withStyles(useStyles)(ProfileStakes);