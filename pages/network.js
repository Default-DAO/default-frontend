import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { mdiShareVariantOutline } from '@mdi/js';

import keys from '../config/keys'
import Text from '../reusable/text'
import Avatar from '../reusable/avatar'
import Card from '../reusable/card'
import Table from '../reusable/table'
import Button from '../reusable/button'
import EpochSelector from '../components/modals/epoch-selector'
import { useStoreApi } from '../store/provider'
import { getNetwork } from '../api/get'
import { format } from '../utils/money'

const Network = props => {
  const store = useStoreApi()
  const { getProtocol, setShowProfile, getMember } = store

  const [epochSelectorOpen, setEpochSelectorOpen] = useState(false)
  const [selectedEpoch, setSelectedEpoch] = useState(getProtocol().epochNumber - 1)
  const [network, setNetwork] = useState(undefined)

  useEffect(() => {
    loadNework(selectedEpoch)
  }, [])

  async function loadNework(epoch) {
    let network = await getNetwork({
      params: {
        epoch,
        ethAddress: getMember().ethAddress
      },
      store
    })
    if (!network) return
    setNetwork(network)
  }

  function renderTableHeader() {
    return <span className={classes.header}>
      <span className={classes.profileContainer}>
      </span>
      <span className={classes.cellInfoContainer}>
        <Text fontWeight={700} className={classes.points}>Points</Text>
        <Text fontWeight={700} className={classes.dntAmount}>Contributor Reward</Text>
        <Text fontWeight={700} className={classes.percentage}>% of Total</Text>
      </span>
    </span>
  }

  function handleCellClick(cell) {
    const { ethAddress, alias } = cell
    setShowProfile({
      selectedTab: 1,
      selectedEpoch,
      ethAddress,
      alias
    })
  }

  function roundDecimal(value) {
    return Math.round(value * 100) / 100
  }

  function renderNetworkCell(cell) {
    const { classes } = props
    const { alias, points, amountDnt, percentTotal } = cell

    return <Card onClick={() => handleCellClick(cell)} className={classes.cell}>
      <span className={classes.profileContainer}>
        <Avatar member={cell} size={40}></Avatar>
        <Text margin="0px 0px 0px 15px" fontSize={20}>{alias}</Text>
      </span>
      <span className={classes.cellInfoContainer}>
        <Text className={classes.points}>{format(points, 3)}</Text>
        <Text className={classes.dntAmount}>?? {format(amountDnt, 3)}</Text>
        <Text className={classes.percentage}>{roundDecimal(percentTotal * 100)} %</Text>
      </span>
    </Card>
  }

  const { classes } = props
  return (
    <div className={classes.container}>
      <div className={classes.network}>
        <div className={classes.header}>
          <Text type="paragraph" fontSize={20} fontWeight={700}>History</Text>
          <Button
            onClick={() => setEpochSelectorOpen(true)}
            type="secondary" className={classes.epochButton} width={110}>
            Epoch {selectedEpoch}
          </Button>
        </div>
        <div className={classes.table}>
          {renderTableHeader()}
          <Table
            text='No network to show'
            list={network}
            renderCell={value => renderNetworkCell(value)}
            icon={mdiShareVariantOutline}
            width="100%"
            height="60vh"
            onScroll={async () => {
              await loadNework(selectedEpoch)
            }}
          />
        </div>
        <EpochSelector
          open={epochSelectorOpen}
          close={() => setEpochSelectorOpen(false)}
          title={'Select epoch'}
          action={(selected) => {
            setSelectedEpoch(selected)
            loadNework(selected)
            setEpochSelectorOpen(false)
          }}
          maxEpoch={getProtocol().epochNumber - 1}
        />
      </div>
    </div>
  )
}

const useStyles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    padding: '0px 200px'
  },
  network: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'hidden',
    width: '100%',
    padding: '30px 0px',
    // height: '80vh'
  },
  epochButton: {
    fontWeight: 700,
    fontSize: 15,
    padding: '8px 10px'
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
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
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '17px 20px 10px 20px'
  },
  cellInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  profile: {
    width: 150,
    textAlign: 'left'
  },
  points: {
    width: 150,
    textAlign: 'left'
  },
  dntAmount: {
    width: 150,
    textAlign: 'right'
  },
  percentage: {
    width: 150,
    textAlign: 'right'
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: keys.WHITE,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7
    }
  }
});

export default withStyles(useStyles)(Network);