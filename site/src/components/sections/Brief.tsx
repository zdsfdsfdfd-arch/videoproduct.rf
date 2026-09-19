import { useState, type FormEvent } from 'react';
import { BRIEF_TOTAL, briefFlow, briefResult } from '@/content/brief';
import { contacts } from '@/content';
import { sendLead } from '@/lib/leads';
import styles from './Brief.module.css';

type Status = 'idle' | 'sending' | 'error';

/**
 * 09 / Бриф — one question per screen, the next one depends on the previous answer, then contacts,
 * then a tariff estimate mapped from the answers. Answers go to the studio's Telegram.
 */
export function Brief() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const flow = briefFlow(answers);
  const asking = step < flow.length;
  const atContacts = step === flow.length;
  const done = step > flow.length;
  const result = briefResult(answers);

  const pick = (label: string) => {
    const next = answers.slice(0, step);
    next[step] = label;
    setAnswers(next);
    setStep(step + 1);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => {
    setStep(0);
    setAnswers([]);
    setName('');
    setContact('');
    setStatus('idle');
    setError('');
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (contact.trim().length < 5) {
      setError('УКАЖИТЕ ТЕЛЕФОН ИЛИ E-MAIL');
      return;
    }
    setError('');
    setStatus('sending');
    try {
      await sendLead({ kind: 'brief', name: name.trim(), contact: contact.trim(), answers, result: result.title });
      setStatus('idle');
      setStep(flow.length + 1);
    } catch {
      setStatus('error');
      setError(`НЕ УДАЛОСЬ ОТПРАВИТЬ — ПОЗВОНИТЕ ${contacts.phoneDisplay}`);
    }
  };

  const shownStep = Math.min(step + 1, BRIEF_TOTAL);
  const width = `${Math.round((Math.min(step, BRIEF_TOTAL) / BRIEF_TOTAL) * 100)}%`;

  return (
    <section id="sp-09" data-scene className={styles.section} aria-label="09 Бриф">
      <div className="grid12">
        <div className={`${styles.index} mono mono-dim`}>
          09 / БРИФ
          <br />
          ~1,5 МИНУТЫ
        </div>
        <div className={styles.progress}>
          <span className={`${styles.stepLabel} mono`} aria-live="polite">
            ШАГ {String(shownStep).padStart(2, '0')} / {String(BRIEF_TOTAL).padStart(2, '0')}
          </span>
          <span className={styles.bar}>
            <span className={styles.barFill} style={{ width }} />
          </span>
        </div>

        <div className={styles.stage}>
          {asking && (
            <div key={step} className={styles.panel}>
              <h2 className={styles.question}>{flow[step].question}</h2>
              <ul className={styles.options}>
                {flow[step].options.map((opt, n) => (
                  <li key={opt} className={styles.option}>
                    <button type="button" data-cursor="ВЫБРАТЬ" className={styles.optionBtn} onClick={() => pick(opt)}>
                      {opt}
                      <span className={styles.optionNum}>{String(n + 1).padStart(2, '0')}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {step > 0 && (
                <button type="button" className={styles.back} onClick={back}>
                  ← НАЗАД
                </button>
              )}
            </div>
          )}

          {atContacts && (
            <form className={styles.panel} onSubmit={submit} noValidate>
              <h2 className={styles.question}>Куда отправить расчёт</h2>
              <div className={styles.fields}>
                <label className={styles.field}>
                  <span className={`${styles.fieldLabel} mono`}>ИМЯ</span>
                  <input type="text" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} />
                </label>
                <label className={styles.field}>
                  <span className={`${styles.fieldLabel} mono`}>ТЕЛЕФОН ИЛИ E-MAIL</span>
                  <input type="text" name="contact" autoComplete="tel email" inputMode="email" value={contact} onChange={(e) => setContact(e.target.value)} className={styles.input} required />
                </label>
              </div>
              <div className={styles.actions}>
                <button type="submit" data-cursor="ОТПРАВИТЬ" className={styles.submit} disabled={status === 'sending'}>
                  {status === 'sending' ? 'ОТПРАВЛЯЕМ…' : 'ОТПРАВИТЬ БРИФ →'}
                </button>
                <button type="button" className={styles.back} onClick={back}>
                  ← НАЗАД
                </button>
              </div>
              {error && (
                <p className={`${styles.error} mono`} role="alert">
                  {error}
                </p>
              )}
            </form>
          )}

          {done && (
            <div className={styles.panel}>
              <div className={`${styles.resultLabel} mono`}>ОРИЕНТИР ПО ВАШИМ ОТВЕТАМ</div>
              <h2 className={styles.resultTitle}>{result.title}</h2>
              <p className={styles.resultNote}>{result.note}</p>
              <ul className={styles.summary}>
                {answers.filter(Boolean).map((a, n) => (
                  <li key={a}>
                    {String(n + 1).padStart(2, '0')} · {a}
                  </li>
                ))}
              </ul>
              <div className={styles.resultActions}>
                <a href={contacts.phoneHref} data-cursor="ПОЗВОНИТЬ" className={styles.callBtn}>
                  {contacts.phoneDisplay}
                </a>
                <a href={contacts.emailHref} data-cursor="НАПИСАТЬ" className={styles.mailBtn}>
                  {contacts.email.toUpperCase()}
                </a>
                <button type="button" className={styles.back} onClick={reset}>
                  ПРОЙТИ ЗАНОВО
                </button>
              </div>
            </div>
          )}
        </div>

        <p className={styles.note}>ОТВЕТЫ ОТПРАВЛЯЮТСЯ КОМАНДЕ СТУДИИ · ПО НИМ ГОТОВИТСЯ ИНДИВИДУАЛЬНЫЙ РАСЧЁТ</p>
      </div>
    </section>
  );
}
