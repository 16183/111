import { fromWei, hexToNumberString } from 'web3-utils'

/**
 * 判断是否处理连接状态
 */
export const isConnected = async (): Promise<boolean> => {
  const data = await window.ethereum.request({ method: 'eth_accounts' })
  if (data && Array.isArray(data) && data.length) {
    return true
  }
  return false
}

/**
 * 判断钱包是否解锁
 */
export const isUnlocked = async (): Promise<boolean> => {
  return window.ethereum._metamask.isUnlocked()
}

/**
 * 获取钱包账户
 */
export const getAccount = async (): Promise<string | void> => {
  // 进行监听钱包
  walletListener()
  const data = await window.ethereum.request({ method: 'eth_requestAccounts' })
  if (data && Array.isArray(data)) {
    if (data.length) {
      getNetwork()
      getBalance(data[0])
      return data[0]
    } else {
      // 钱包锁定或者没有创建账户
      checkWallet()
    }
  }
}

/**
 * 获取网络
 */
export const getNetwork = async (): Promise<void> => {
  const chainId = await window.ethereum.request({
    method: 'eth_chainId'
  })
  // if (parseInt(chainId, 16) !== 97) {
  //   alert('请选择 BSC 网络')
  // }
}

/**
 * 获取账户余额
 */
export const getBalance = async (address: string): Promise<string> => {
  const walletBalance = await window.ethereum.request({
    method: 'eth_getBalance',
    params: [address, 'latest']
  })

  const num = hexToNumberString(walletBalance)
  const number = fromWei(num)
  return number
}

/**
 * 判断钱包
 * 锁定状态
 * 没有创建账户
 */
export const checkWallet = async (): Promise<void> => {
  const unlocked = await isUnlocked()
  if (unlocked) {
    // 钱包没有创建账户
  } else {
    // 钱包被锁定提示
  }
}

/**
 * 监听钱包
 */
export const walletListener = (): void => {
  window.ethereum.on('accountsChanged', (accounts: [string]) => {
    // 授权地址改变
    if (accounts && Array.isArray(accounts)) {
      if (accounts.length) {
        getBalance(accounts[0])
        return accounts[0]
      } else {
        // 钱包锁定或者没有创建账户
        checkWallet()
      }
    }
  })
  // window.ethereum.on('chainChanged', (chainId: string) => {
  //   if (parseInt(chainId, 16) !== 97) {
  //     // 请选择 Rinkeby 网络
  //     alert('请选择 BSC 网络')
  //   }
  // })
}
