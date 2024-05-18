import { CheckIcon, SmallCloseIcon } from '@chakra-ui/icons';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import styles from './index.module.css';

const Compare = () => {
  const t = useTranslations('teamz');

  return (
    <div>
      <h2
        className={classNames(
          'text-center text-1xl md:text-4xl text-[#AAFF03] md:mb-9 mb-6 py-6',
        )}
        style={{ borderBottom: 'solid 1px #4d4d4d' }}
      >
        COMPARE TICKETS
      </h2>
      <section className={classNames('flex text-slate-400 text-xs')}>
        <div
          className={classNames(
            styles['col-item'],
            styles['left-col'],
            'max-sm:w-[50vw]',
          )}
        >
          <div className={styles.th} />
          <div>{t('compare_title_1' as any)}</div>
          <div>{t('compare_title_2' as any)}</div>
          <div>{t('compare_title_3' as any)}</div>
          <div>{t('compare_title_4' as any)}</div>
          <div>{t('compare_title_5' as any)}</div>
          <div>{t('compare_title_6' as any)}</div>
          <div>{t('compare_title_7' as any)}</div>
          <div>{t('compare_title_8' as any)}</div>
          <div>{t('compare_title_9' as any)}</div>
          <div>{t('compare_title_10' as any)}</div>
          <div>{t('compare_title_11' as any)}</div>
          <div>{t('compare_title_12' as any)}</div>
          <div>{t('compare_title_13' as any)}</div>
          <div>{t('compare_title_14' as any)}</div>
          <div>{t('compare_title_15' as any)}</div>
          <div>{t('compare_title_16' as any)}</div>
        </div>
        <div
          className={classNames(
            'grid grid-cols-5 flex-1',
            styles['ticket-compare-right'],
          )}
        >
          <div className={classNames(styles['col-item'])}>
            <div className={styles.th}>
              <div className={styles['circle']} />
              <div className="font-bold text-base md:text-lg">
                Express
                <br />
                Ticket
                <br />
              </div>
              <div>(1 x Person)</div>
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">¥7,900</div>
            <div className="text-center">¥12,000</div>
          </div>
          <div
            className={classNames(
              ' bg-[#3D3D3D] rounded-tl-lg rounded-tr-lg',
              styles['col-item'],
            )}
          >
            <div className={styles.th}>
              <div className={classNames(styles['circle'], styles['purple'])} />
              <div className="font-bold text-base md:text-lg">
                General <br />
                Pass
              </div>
              <div>(1 x Person)</div>
              <h2 className="text-[#8fff00] text-[11px] mt-2">POPULAR</h2>
            </div>
            <div className="text-center indent-[-999rem]">
              {/* <CheckIcon color="#AAFF03" /> */}
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">¥9,900</div>
            <div className="text-center">¥15,000</div>
          </div>
          <div className={classNames(styles['col-item'])}>
            <div className={styles.th}>
              <div className={classNames(styles['circle'], styles['blue'])} />
              <div className="font-bold text-base md:text-lg">
                Business <br />
                Pass
              </div>
              <div>(2 × People)</div>
            </div>
            <div className="text-center indent-[-999rem]">
              {/* <CheckIcon color="#AAFF03" /> */}
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <div>
                ¥8,900
                <p className="text-[10px]">(Total: ¥17,800)</p>
              </div>
            </div>
            <div className="text-center">
              <div>
                ¥13,000
                <p className="text-[10px]">(Total: ¥26,000)</p>
              </div>
            </div>
          </div>
          <div className={classNames(styles['col-item'])}>
            <div className={styles.th}>
              <div className={classNames(styles['circle'], styles['red'])} />
              <div className="font-bold text-base md:text-lg">
                Red <br />
                Carpet
              </div>
              <div>(1 x Person)</div>
            </div>
            <div className="text-center indent-[-999rem]">
              {/* <CheckIcon color="#AAFF03" /> */}
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">
              <SmallCloseIcon />
            </div>
            <div className="text-center">¥22,900</div>
            <div className="text-center">¥30,000</div>
          </div>
          <div className={classNames(styles['col-item'])}>
            <div className={styles.th}>
              <div className={classNames(styles['circle'], styles['yellow'])} />
              <div className="font-bold text-base md:text-lg">
                VIP <br />
                Pass
              </div>
              <div>(1 x Person)</div>
            </div>
            <div className="text-center indent-[-999rem]">
              {/* <CheckIcon color="#AAFF03" /> */}
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">
              <CheckIcon color="#AAFF03" />
            </div>
            <div className="text-center">¥49,900</div>
            <div className="text-center">¥80,000</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Compare;
