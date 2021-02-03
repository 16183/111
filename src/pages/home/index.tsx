import React, { useState, useCallback } from 'react';
import { NavLink } from 'umi';
import { Modal, notification } from 'antd';
import Loading from '@/components/loading';
import useUser from '@/hooks/user';
import UnlockButton from '@/components/unlock-button';
import { zoo, zooType } from '@/data';
import { getAnimalBg } from '@/components/animal-card';
import ChangeLocale from '@/components/change-locale';

import logo from '../../assets/images/logo.png';
import homeBtn from '../../assets/images/home-btn.png';
import marketBtn from '../../assets/images/market-btn.png';
import profileBtn from '../../assets/images/profile-btn.png';
import buyBtn from '../../assets/images/buy_btn.png';
import unlockBtn from '../../assets/images/unlock_btn.png';

import styles from './styles.less';

import { getAccount } from '@/service/metamask'
import { create } from '../../service/nft'

export default () => {
  const [isShow, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(1 as zooType);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { address, setAddress } = useUser();

  const onClick = useCallback(async () => {
    if (address) {
      setLoading(true);
      const data = await create().catch(() => { });
      if (data && data.tx.wait) {
        // 监听砸蛋成功事件
        data.contract.on('Creat', (_address, animal: zooType, tokenID, event) => {
          if (address.toUpperCase() == _address.toUpperCase()) {
            // 显示砸蛋动效
            setShow(true);
            setLoading(false);
            setId(animal);
            setIsModalVisible(true);
            setTimeout(() => {
              // 隐藏砸蛋动效
              setShow(false);
            }, 2000);
          }
        });
        await data.tx.wait();
      } else {
        setLoading(false);
        notification.error({
          message: '温馨提示',
          description: '砸蛋失败，可能余额不足0.01 ETH'
        });
      }
    } else {
      const addr = await getAccount();
      if (addr) {
        setAddress(addr)
      }
    }
  }, [address]);

  const modalClose = () => {
    setIsModalVisible(false);
    setShow(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <nav className={styles.nav}>
        <img src={logo} />
        <div style={{ display: 'flex' }}>
          <ChangeLocale />
          <UnlockButton />
        </div>
      </nav>

      <div className={styles['route-btn']}>
        <img src={homeBtn} />
        <NavLink to="/market">
          <img src={marketBtn} />
        </NavLink>
        <NavLink to="/profile">
          <img src={profileBtn} />
        </NavLink>
      </div>

      <div className={isModalVisible ? `${styles['egg-container']} ${styles['hide']}` : styles['egg-container']}>
        <div onClick={onClick} className={styles.egg}></div>
      </div>

      <div className={styles['home-btn']}>
        {address ? <div>
          <img src={buyBtn} onClick={onClick} alt="buy" />
        </div> : <div>
            <img src={unlockBtn} onClick={onClick} alt="unlock" />
          </div>}
      </div>

      {loading && <Loading content="砸蛋中..." />}
      <Modal className={styles.modal} onCancel={modalClose} footer={null} visible={isModalVisible}>
        <div className={styles['center']}>
          {isShow ? <div className={styles['egg-smash']}></div> :
            <div>
              <div className={styles['title']}>恭喜您！获得了一级萌宠：{zoo[id]}</div>
              <div className={getAnimalBg(id)}></div>
            </div>
          }
        </div>
      </Modal>
    </div>
  );
}
