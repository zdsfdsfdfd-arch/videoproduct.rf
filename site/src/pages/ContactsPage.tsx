import { PageShell } from './PageShell';
import { Contact } from '@/components/sections/Contact';
import { Geography } from '@/components/sections/Geography';
import { cities, contacts } from '@/content';
import { address } from '@/content/pages';
import styles from './ContactsPage.module.css';

/** Контакты — every way to reach the studio, the Kazan address, where the crew travels, the form. */
export function ContactsPage() {
  return (
    <PageShell index="07" kicker="КАЗАНЬ · МОСКВА · САНКТ-ПЕТЕРБУРГ · ВСЯ РОССИЯ" title={<>Контак<em>ты</em></>}>
      <section className={styles.cards} aria-label="Как связаться" data-scene>
        <a href={contacts.phoneHref} className={styles.card}>
          <span className={`${styles.cardLabel} mono`}>ТЕЛЕФОН</span>
          <span className={styles.cardValue}>{contacts.phoneDisplay}</span>
          <span className={`${styles.cardHint} mono`}>ЗВОНОК ИЛИ СМС</span>
        </a>
        <a href={contacts.whatsapp} target="_blank" rel="noopener" className={styles.card}>
          <span className={`${styles.cardLabel} mono`}>WHATSAPP</span>
          <span className={styles.cardValue}>Написать</span>
          <span className={`${styles.cardHint} mono`}>ОТКРОЕТСЯ ЧАТ</span>
        </a>
        <a href={contacts.emailHref} className={styles.card}>
          <span className={`${styles.cardLabel} mono`}>E-MAIL</span>
          <span className={`${styles.cardValue} ${styles.cardMail}`}>{contacts.email}</span>
          <span className={`${styles.cardHint} mono`}>БРИФ, РЕФЕРЕНСЫ, ФАЙЛЫ</span>
        </a>
        <a href={address.mapUrl} target="_blank" rel="noopener" className={styles.card}>
          <span className={`${styles.cardLabel} mono`}>СТУДИЯ</span>
          <span className={styles.cardValue}>
            {address.city},<br />
            {address.street}
          </span>
          <span className={`${styles.cardHint} mono`}>ОТКРЫТЬ НА КАРТЕ →</span>
        </a>
      </section>

      <section className={styles.where} aria-label="Где снимаем" data-scene>
        <div className={`${styles.head} mono mono-dim`}>
          <span>ГДЕ СНИМАЕМ</span>
          <span>25 ГОРОДОВ · СТУДИЯ ВЫЕЗЖАЕТ НА ОБЪЕКТ</span>
        </div>
        <div className={styles.whereGrid}>
          <div className={styles.whereCol}>
            <span className={`${styles.whereLabel} mono`}>БАЗА</span>
            <span className={styles.whereValue}>Казань</span>
            <p className={styles.whereText}>Собственная студия и склад оборудования. Подкасты, интервью, предметная съёмка — здесь.</p>
          </div>
          <div className={styles.whereCol}>
            <span className={`${styles.whereLabel} mono`}>ПОСТОЯННО</span>
            {/* «САНКТ-ПЕТЕРБУРГ» is hyphenated: capitalise after every hyphen, not just at the start */}
            <span className={styles.whereValue}>{cities.map((c) => c.toLowerCase().replace(/(^|-)(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase())).join(' · ')}</span>
            <p className={styles.whereText}>Съёмочные группы регулярно работают в трёх городах — без наценки за «командировку в столицу».</p>
          </div>
          <div className={styles.whereCol}>
            <span className={`${styles.whereLabel} mono`}>ВЫЕЗД</span>
            <span className={styles.whereValue}>Вся Россия</span>
            <p className={styles.whereText}>Заводы, стройки, объекты в регионах: съёмки прошли в 25 городах. Командировки закладываются в расчёт.</p>
          </div>
        </div>
      </section>

      {/* geography (10) before the closing contact spread (12), so the section numbers keep rising */}
      <Geography />
      <Contact />
    </PageShell>
  );
}
