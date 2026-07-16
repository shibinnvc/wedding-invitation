/* Sabeeha Abdul Nasir & Muhammed Shibin — Wedding invitation interactivity */
(function () {
  "use strict";

  const entry    = document.getElementById("entry");
  const envelope = document.getElementById("envelope");
  const invite   = document.getElementById("invite");
  const openBtn  = document.getElementById("open-invitation");
  const audio    = document.getElementById("bg-audio");
  const audioBtn = document.getElementById("audio-toggle");
  const calBtn   = document.getElementById("add-calendar");

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let opened = false;

  /* ---------- Start the nasheed (user gesture allows playback) ---------- */
  function startAudio() {
    if (!audio) return;
    audio.volume = 0.1;
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        audioBtn && audioBtn.setAttribute("aria-pressed", "false");
        audioBtn && audioBtn.setAttribute("aria-label", "Mute music");
      }).catch(() => {
        // Autoplay blocked — reflect muted state so the button can start it.
        audioBtn && audioBtn.setAttribute("aria-pressed", "true");
        audioBtn && audioBtn.setAttribute("aria-label", "Play music");
      });
    }
  }

  /* ---------- Reveal screen 2 ---------- */
  function revealInvitation() {
    entry.classList.add("is-leaving");
    const show = () => {
      entry.hidden = true;
      invite.hidden = false;
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    let done = false;
    const finish = () => { if (!done) { done = true; show(); } };
    entry.addEventListener("animationend", finish, { once: true });
    setTimeout(finish, 650);
  }

  /* ---------- Open the envelope, then reveal ---------- */
  function openInvitation() {
    if (opened || !entry || !invite) return;
    opened = true;

    // Audio is triggered by this click — the qualifying user gesture.
    startAudio();

    if (reduceMotion) {
      revealInvitation();
      return;
    }

    // Play the envelope-opening choreography, then cross-fade.
    envelope && envelope.classList.add("is-open");
    setTimeout(revealInvitation, 1750);
  }

  if (openBtn) openBtn.addEventListener("click", openInvitation);

  /* ---------- Mute / Unmute ---------- */
  if (audioBtn && audio) {
    audioBtn.addEventListener("click", () => {
      if (audio.paused) {
        const p = audio.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            audioBtn.setAttribute("aria-pressed", "false");
            audioBtn.setAttribute("aria-label", "Mute music");
          }).catch(() => {});
        } else {
          audioBtn.setAttribute("aria-pressed", "false");
          audioBtn.setAttribute("aria-label", "Mute music");
        }
      } else {
        audio.pause();
        audioBtn.setAttribute("aria-pressed", "true");
        audioBtn.setAttribute("aria-label", "Play music");
      }
    });
  }

  /* ---------- Auto-pause music when tab is hidden; resume on return ---------- */
  if (audio && audioBtn) {
    document.addEventListener("visibilitychange", () => {
      const userMuted = audioBtn.getAttribute("aria-pressed") === "true";
      if (document.hidden) {
        if (!audio.paused) audio.pause();
      } else if (opened && !userMuted && audio.paused) {
        const p = audio.play();
        if (p && typeof p.then === "function") p.catch(() => {});
      }
    });
  }

  /* ---------- Add to calendar (.ics download) ---------- */
  // Saturday 29 August 2026, 11:00 AM – 2:00 PM IST (Asia/Kolkata, UTC+05:30)
  //  → 11:00 IST = 05:30 UTC,  14:00 IST = 08:30 UTC
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function icsContent() {
    const dtStamp = (() => {
      const d = new Date();
      return (
        d.getUTCFullYear() +
        pad(d.getUTCMonth() + 1) +
        pad(d.getUTCDate()) +
        "T" +
        pad(d.getUTCHours()) +
        pad(d.getUTCMinutes()) +
        pad(d.getUTCSeconds()) +
        "Z"
      );
    })();

    const uid = "sabeeha-abdul-nasir-muhammed-shibin-wedding-2026-08-29@invite";
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-// Muhammed Shibin & Sabeeha Abdul Nasir//Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + uid,
      "DTSTAMP:" + dtStamp,
      "DTSTART:20260829T053000Z",
      "DTEND:20260829T083000Z",
      "SUMMARY:Wedding — Muhammed Shibin & Sabeeha Abdul Nasir",
      "LOCATION:JAS Auditorium, Kozhikode – Palakkad Highway (NH 966), Vattambalam, Kumaramputhur, Mannarkkad, Palakkad, Kerala 678583",
      "DESCRIPTION:Wedding of Muhammed Shibin & Sabeeha Abdul Nasir. Wedding will be followed by lunch reception. Your duas & presence mean a lot.",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Muhammed Shibin & Sabeeha Abdul Nasir's Wedding is tomorrow",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    return lines.join("\r\n");
  }

  function downloadICS() {
    const blob = new Blob([icsContent()], { type: "text/calendar;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = "Muhammed-Shibin-and-Sabeeha-Abdul-Nasir-Wedding.ics";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  if (calBtn) calBtn.addEventListener("click", downloadICS);
})();
