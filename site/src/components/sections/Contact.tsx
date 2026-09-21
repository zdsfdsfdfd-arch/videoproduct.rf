import { useState, type FormEvent } from 'react';
import { delay } from '@/lib/reveal';
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
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status !== 'idle') return;
    setFailed(false);
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
      // the form is only as good as the backend — on a failure give a way to reach the studio by hand
      setStatus('idle');
      setFailed(true);
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

      <h2 data-reveal="display" className={styles.title}>
        <span className={styles.t1}>Сделаем</span>
        <span className={styles.t2}>
          кадр<span className={styles.dot}>.</span>
        </span>
      </h2>

      <form data-reveal style={delay(120)} className={styles.consult} onSubmit={submit} noValidate>
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
        <button type="submit" className={styles.submit} disabled={status !== 'idle'}>
          {status === 'sent' ? 'ОТПРАВЛЕНО ✓' : status === 'sending' ? 'ОТПРАВЛЯЕМ…' : 'ПОЛУЧИТЬ БЕСПЛАТНУЮ КОНСУЛЬТАЦИЮ →'}
        </button>
        <label className={styles.agree}>
          <input type="checkbox" name="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} className={styles.checkbox} disabled={status === 'sent'} />
          <span>Я ДАЮ СОГЛАСИЕ НА ОБРАБОТКУ МОИХ ПЕРСОНАЛЬНЫХ ДАННЫХ</span>
        </label>
        {failed ? (
          <p className={`${styles.note} mono`} role="status">
            НЕ УДАЛОСЬ ОТПРАВИТЬ · НАПИШИТЕ ИЛИ ПОЗВОНИТЕ{' '}
            <a href={contacts.phoneHref} className={styles.noteLink}>
              {contacts.phoneDisplay}
            </a>{' '}
            ·{' '}
            <a href={contacts.whatsapp} target="_blank" rel="noopener" className={styles.noteLink}>
              WHATSAPP
            </a>
          </p>
        ) : (
          note && (
            <p className={`${styles.note} mono`} role="status">
              {note}
            </p>
          )
        )}
      </form>

      <div className={styles.grid}>
        <div>
          <div className={`${styles.cellLabel} mono`}>ТЕЛЕФОН</div>
          <a href={contacts.phoneHref} className={`${styles.big} ${styles.link}`}>
            {contacts.phoneDisplay}
          </a>
        </div>
        <div>
          <div className={`${styles.cellLabel} mono`}>E-MAIL</div>
          <a href={contacts.emailHref} className={`${styles.mail} ${styles.link}`}>
            {contacts.email}
          </a>
        </div>
        <div>
          <div className={`${styles.cellLabel} mono`}>МЕССЕНДЖЕРЫ</div>
          <div className={styles.stack}>
            <a href={contacts.whatsapp} target="_blank" rel="noopener" className={`${styles.mid} ${styles.link}`}>
              WhatsApp
            </a>
            {/* The studio has not given a Telegram link yet — the line appears as soon as contacts.telegram is set. */}
            {contacts.telegram && (
              <a href={contacts.telegram} target="_blank" rel="noopener" className={`${styles.mid} ${styles.link}`}>
                Telegram
              </a>
            )}
          </div>
        </div>
        <div>
          <div className={`${styles.cellLabel} mono`}>ДАЛЬШЕ</div>
          <div className={styles.stack}>
            <a href="#sp-09" onClick={onClick} className={`${styles.mid} ${styles.link}`}>
              Заполнить бриф
            </a>
            <a href="#sp-02" onClick={onClick} className={`${styles.mid} ${styles.link}`}>
              Портфолио
            </a>
          </div>
        </div>
      </div>

      <div className={styles.foot}>
        <span>{contacts.brand} · ВИДЕОПРОДАКШН ПОЛНОГО ЦИКЛА</span>
        <span>ПОРТФОЛИО 100+ · СТАТЬИ 200+ · ВСТУПИТЬ В КОМАНДУ</span>
        {/* No privacy-policy document was supplied; the link appears as soon as contacts.privacyPolicy is set. */}
        {contacts.privacyPolicy && (
          <a href={contacts.privacyPolicy} className={styles.footLink}>
            ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
          </a>
        )}
      </div>
    </section>
  );
}
