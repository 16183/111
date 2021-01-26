import React from 'react';
import useUser from '@/hooks/user';
import { getAccount } from '@/service/metamask'

import styles from './styles.less';

const simpleAdress = (address: string) => {
  if (!address) return '';

  const length = address.length;

  const start = address.substring(0, 4);
  const end = address.substr(length - 4, 4);

  return `${start}...${end}`;
}


export default function UnlockButton() {
  const { address, setAddress, } = useUser();

  const onClick = React.useCallback(async () => {
    if(!address) {
      const addr = await getAccount();
      addr && setAddress(addr);
    }
  }, [address]);

  return <div onClick={onClick} className={styles['login-btn']}>{address ? simpleAdress(address) : 'Unlock Wallet'}</div>
}
