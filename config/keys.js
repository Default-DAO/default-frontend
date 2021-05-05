const shortid = require('shortid')

const APP_NAME = 'Default'
const BACKGROUND_COLOR = '#1c1c1c'
const PRIMARY_COLOR = '#9d26ff'
const SECONDARY_COLOR = 'rgb(33, 114, 229) 100%)'
const TERTIARY_COLOR = 'rgb(237, 238, 242)'
const GRADIENT = `radial-gradient(174.47% 188.91% at 1.84% 0%, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR}, ${TERTIARY_COLOR}`

const GRAY = '#212121'
const DARK_GRAY = '#141414'
const WHITE = '#ffffff'

const WEB_3 = 'WEB_3'
const ETH_ADDRESS = "ETH_ADDRESS"
const ETH_BALANCE = "ETH_BALANCE"

const SHOW_TOAST = 'SHOW_TOAST'
const IS_LOADING = 'IS_LOADING'
const USER = 'USER'
const POOL = 'POOL'
const PROTOCOL = 'PROTOCOL'
const SHOW_ADD_LIQUIDITY = 'SHOW_ADD_LIQUIDITY'
const SHOW_SWAP_LIQUIDITY = 'SHOW_SWAP_LIQUIDITY'
const SHOW_WITHDRAW_LIQUIDITY = 'SHOW_WITHDRAW_LIQUIDITY'
const SHOW_ADD_STAKE_NETWORK = 'SHOW_ADD_STAKE_NETWORK'
const SHOW_ADD_VALUE_NETWORK = 'SHOW_ADD_VALUE_NETWORK'

const DUMMY_USERS = [
  { 
    ethAddress: shortid.generate(),
    alias: "zaz",
  },
  { 
    ethAddress: shortid.generate(),
    alias: "fullyallocated" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "soma" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "melloone" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "maximillius" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "scottsgc" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "zaz" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "fullyallocated" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "soma" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "melloone" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "maximillius" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "scottsgc" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "zaz" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "fullyallocated" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "soma" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "melloone" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "maximillius" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "scottsgc" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "zaz" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "fullyallocated" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "soma" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "melloone" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "maximillius" 
  },
  { 
    ethAddress: shortid.generate(),
    alias: "scottsgc" 
  }
]

module.exports = {
    APP_NAME,
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    SECONDARY_COLOR,
    TERTIARY_COLOR,
    GRADIENT,

    GRAY,
    DARK_GRAY,
    WHITE,

    WEB_3,
    ETH_ADDRESS,
    ETH_BALANCE,
    SHOW_TOAST,
    IS_LOADING,
    USER,
    POOL,
    PROTOCOL,
    SHOW_ADD_LIQUIDITY,
    SHOW_SWAP_LIQUIDITY,
    SHOW_WITHDRAW_LIQUIDITY,
    SHOW_ADD_STAKE_NETWORK,
    SHOW_ADD_VALUE_NETWORK,

    DUMMY_USERS,
}