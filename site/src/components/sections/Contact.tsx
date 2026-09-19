import { useState, type FormEvent } from 'react';
import { contacts } from '@/content';
import { useAnchorClick } from '@/lib/hooks';
import { sendLead } from '@/lib/leads';
import styles from './Contact.module.css';

type Status = 'idle' | 'sending' | 'sent';

/** 12 / Контакт — the closing spread: «Сделаем кадр.», the free-consultation form, real contacts. */
export function Contact() {
  const onClick = useAnchorClick();
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status !== 'idle') return;
    if (phone.replace(/\D/g, '').length < 10) {
      setNote('УКАЖИТЕ НОМЕР ТЕЛЕФОНА');
      return;
    }
    if (!agree) {
      setNote('НУЖНО СОГЛАСИЕ НА ОБРАБОТКУ ДАННЫХ');
      return;
    }
    setStatus('sending');
    setNote('');
    try {
      await sendLead({ kind: 'consult', contact: phone.trim() });
      setStatus('sent');
      setNote('ЗАЯВКА ПРИНЯТА — МЫ ПЕРЕЗВОНИМ');
    } catch {
      setStatus('idle');
      setNote(`НЕ УДАЛОСЬ ОТПРАВИТЬ — ПОЗВОНИТЕ ${contacts.phoneDisplay}`);
    }
  };

  return (
    <section id="sp-12" data-scene className={styles.section} aria-label="12 Контакт">
      <div className={`${styles.head} mono mono-dim`}>
        <span>12 / КОНТАКТ</span>
        <span>
          {contacts.brand} · С {contacts.since} ГОДА
        </span>
      </div>

      <h2 className={styles.title}>
        <span className={styles.t1}>Сделаем</span>
        <span className={styles.t2}>
          кадр<span className={styles.dot}>.</span>
        </span>
      </h2>

      <form className={styles.consult} onSubmit={submit} noValidate>
        <div className={`${styles.consultLabel} mono`}>БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ</div>
        <label className={styles.phoneField}>
          <span className={`${styles.fieldLabel} mono`}>ВАШ ТЕЛЕФОН</span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+7 (000) 000-00-00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.input}
            disabled={status === 'sent'}
          />
        </label>
        <button type="submit" data-cursor="ОТПРАВИТЬ" className={styles.submit} disabled={status !== 'idle'}>
          {status === 'sent' ? 'ОТПРАВЛЕНО ✓' : status === 'sending' ? 'ОТПРАВЛЯЕМ…' : 'ПОЛУЧИТЬ БЕСПЛАТНУЮ КОНСУЛЬТАЦИЮ →'}
        </button>
        <label className={styles.agree}>
          <input type="checkbox" name="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} className={styles.checkbox} disabled={status === 'sent'} />
          <span>Я ДАЮ СОГЛАСИЕ НА ОБРАБОТКУ МОИХ ПЕРСОНАЛЬНЫХ ДАННЫХ</span>
        </label>
        {note && (
          <p className={`${styles.note} mono`} role="status">
            {note}
          </p>
        )}
      </form>

      <div className={styles.grid}>
        <div>
          <div className={`${styles.cellLabel} mono`}>ТЕЛЕФОН</div>
          <a href={contacts.phoneHref} data-cursor="ПОЗВОНИТЬ" className={`${styles.big} ${styles.link}`}>
            {contacts.phoneDisplay}
          </a>
        </div>
        <div>
          <div className={`${styles.cellLabel} mono`}>E-MAIL</div>
          <a href={contacts.emailHref} data-cursor="НАПИСАТЬ" className={`${styles.mail} ${styles.link}`}>
            {contacts.email}
          </a>
        </div>
        <div>
          <div className={`${styles.cellLabel} mono`}>МЕССЕНДЖЕРЫ</div>
          <div className={styles.stack}>
            <a href={contacts.whatsapp} target="_blank" rel="noopener" data-cursor="ОТКРЫТЬ" className={`${styles.mid} ${styles.link}`}>
              WhatsApp
            </a>
            {contacts.telegram ? (
              <a href={contacts.telegram} target="_blank" rel="noopener" data-cursor="ОТКРЫТЬ" className={`${styles.mid} ${styles.link}`}>
                Telegram
              </a>
            ) : (
              <span className={`${styles.mid} ${styles.pending}`} title="Нужна ссылка на аккаунт">
                Telegram
              </span>
            )}
          </div>
        </div>
        <div>
          <div className={`${styles.cellLabel} mono`}>ДАЛЬШЕ</div>
          <div className={styles.stack}>
            <a href="#sp-09" onClick={onClick} data-cursor="ВПЕРЁД" className={`${styles.mid} ${styles.link}`}>
              Заполнить бриф
            </a>
            <a href="#sp-02" onClick={onClick} data-cursor="ВПЕРЁД" className={`${styles.mid} ${styles.link}`}>
              Портфолио
            </a>
          </div>
        </div>
      </div>

      <div className={styles.foot}>
        <span>{contacts.brand} · ВИДЕОПРОДАКШН ПОЛНОГО ЦИКЛА</span>
        <span>ПОРТФОЛИО 100+ · СТАТЬИ 200+ · ВСТУПИТЬ В КОМАНДУ</span>
        {contacts.privacyPolicy ? (
          <a href={contacts.privacyPolicy} className={styles.footLink}>
            ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
          </a>
        ) : (
          <span title="Нужна ссылка на документ">ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ — НУЖНА ССЫЛКА</span>
        )}
      </div>
    </section>
  );
}
