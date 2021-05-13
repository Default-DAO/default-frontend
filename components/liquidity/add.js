import React, { useState, useEffect } from 'react';

import { withStyles } from '@material-ui/core/styles';

import Modal from '../../reusable/modal'
import Text from '../../reusable/text'
import TokenForm from '../../reusable/token-form'
import Button from '../../reusable/button'
import { useStoreApi } from '../../store/provider'
import { addLiquidity } from '../../api/post'
import { sendTransaction, getWeb3 } from '../../api/web3'
import abi from '../../api/erc20.json'

const AddLiquidity = (props) => {
  const store = useStoreApi()
  const {getMember} = store
  const [value, setValue] = useState('')


  const { classes, open, close } = props
  return (
    <Modal width={400} className={classes.modal} open={open} close={close}>
      <Text margin='0px 0px 25px 0px' center type="paragraph" fontSize={24} fontWeight={600} >Add Liquidity</Text>
      <TokenForm
        currencies={['usdc']}
        value={value}
        onValueChange={(value) => setValue(value)}
        selectedToken="usdc"
        onSelectedTokenChange={() => { }}
        balance={getMember().liquidityCapUsdc}
      />
      <Button
        onClick={async () => { 
          let member = getMember()
          if (value > member.liquidityCapUsdc) {
            return store.setShowToast({show: true, text:"This amount is over the limit!"})
          }
          var web3 = getWeb3();
          let contract = new web3.eth.Contract(abi,'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');

          let data = contract.methods.transfer('0xEe4De25a333A96389bc29363ed404814f6211BB3', value).encodeABI()

          await sendTransaction({
            from: getMember().ethAddress,
            // to: '0xEe4De25a333A96389bc29363ed404814f6211BB3',
            // gas: '21000',
            // gasPrice: '21000',
            // value,
            data
          })
          await addLiquidity({
            params: {
              amount: value
            },
            store
          })
        }}
        margin="35px 0px 0px 0px" gradient width={200} height={50}>
        Add!
      </Button>
    </Modal>
  )

}

const useStyles = theme => ({
  modal: {
    padding: '40px 20px',
  }
});

export default withStyles(useStyles)(AddLiquidity);