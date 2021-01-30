import React, { useState, useCallback } from 'react';
import { NavLink } from 'umi';
import { Spin, Modal } from 'antd';
import useUser from '@/hooks/user';
import UnlockButton from '@/components/unlock-button';
import { zoo, zooType } from '@/data';
import { getAnimalBg } from '@/components/animal-card'

import logo from '../../assets/images/logo.png';
import homeBtn from '../../assets/images/home-btn.png';
import marketBtn from '../../assets/images/market-btn.png';
import profileBtn from '../../assets/images/profile-btn.png';

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
      const data = await create();
      if (data.tx.wait) {
        // 监听砸蛋成功事件
        data.contract.on('Creat', (address, animal: zooType, tokenID, event) => {
          setId(animal);
          setIsModalVisible(true);
        });
        await data.tx.wait();
        // 显示砸蛋动效
        setShow(true);
      }
      setLoading(false);
    } else {
      const addr = await getAccount()
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
      <div className={styles.bg}/>
      <nav className={styles.nav}>
        <img src={logo} />
        <UnlockButton />
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

      <Spin spinning={loading}>
        <div className={ isShow ? styles['egg-smash'] : styles['egg-container']}>
          { isShow ? '' : <div onClick={onClick} className={styles.egg}></div> }
        </div>
      </Spin>

      <Modal title="获得萌宠" onCancel={modalClose} footer={null} visible={isModalVisible}>
        <div className={styles['center']}>
          <div className={styles['title']}>恭喜您！获得了萌宠：{zoo[id]}</div>
          <div className={getAnimalBg(id)}></div>
        </div>
      </Modal>
    </div>
  );
}
