import { ethers } from 'ethers'
import abi from '../abi/abi.json'

const contractAddress = '0xbbe70a97099f7ee58967c9323daa8901f076ebb5'

const getProvider = () => {
  return new ethers.providers.Web3Provider(window.ethereum)
}

const getContract = () => {
  return new ethers.Contract(contractAddress, abi, getProvider())
}

/**
 * 需要签名的contract
 */
const getSignerContract = () => {
  return new ethers.Contract(contractAddress, abi, getProvider().getSigner())
}

/**
 * 创建动物，开蛋
 */
export const create = async () => {
  const contract = getSignerContract()
  // Return: uint8 （1 ~ 12）分别代表12个动物（12生肖顺序）
  const data = await contract.create()
  console.log(data)
}

/**
 * 升级
 */
export const upgrade = async (token1: string, token2: string) => {
  const contract = getSignerContract()

  // Return: bool （升级是否成功）
  const status = await contract.upgrade(token1, token2)
}

/**
 * 系统赎回
 */
export const redeem = async (token: string) => {
  const contract = getSignerContract()

  const status = await contract.redeem(token)
}

/**
 * 竞拍出售
 */
export const sellBids = async (token: string, price: number) => {
  const contract = getSignerContract()

  const status = await contract.sellBids(token, price)
}

/**
 * 竞拍购买
 * @param level: 等级
 * @param type: 生肖
 * @param price: 价格
 */
export const buyBids = async (level: number, type: number, price: number) => {
  const contract = getSignerContract()

  const status = await contract.buyBids(level, type, price)
}

/**
 * 取消出售订单
 */
export const cancleSell = async (token: string) => {
  const contract = getSignerContract()

  const status = await contract.cancleSell(token)
}

/**
 * 取消购买订单
 */
export const cancleBuy = async (level: number, type: number) => {
  const contract = getSignerContract()

  const status = await contract.cancleBuy(level, type)
}

/**
 * 主动购买
 */
export const buy = async (level: number, type: number, maxPrice: number) => {
  const contract = getSignerContract()

  const status = await contract.cancleBuy(level, type, maxPrice)
}

/**
 * 主动出售
 */
export const sell = async (token: string, minPrice: number) => {
  const contract = getSignerContract()

  const status = await contract.cancleBuy(token, minPrice)
}

/**
 * 转给其他人
 */
export const transfer = async (fromAddress: string, toAddress: string, tokenId: string) => {
  const contract = getSignerContract()

  const data = await contract.transferFrom(fromAddress, toAddress, tokenId)
}

/**
 * 获取用户生肖
 */
export const getBalanceOf = async (address: string) => {
  const contract = getContract()

  const data = await contract.balanceOf(address)
}

/**
 * 根据tokenid获取其动物属性
 */
export const getAnimalInfo = async (tokenId: string) => {
  const contract = getContract()

  const data = await contract.getAnimalInfo(tokenId)
}

/**
 * 根据级别和动物，查询是否有人出售
 */
export const getIsSale = async (level: number, type: number) => {
  const contract = getContract()

  const data = await contract.onSale(level, type)
}

/**
 * 根据级别和无动查询是否有人购买
 */
export const getIsOnPurchased = async (level: number, type: number) => {
  const contract = getContract()

  const status = await contract.onPurchase(level, type)
}
