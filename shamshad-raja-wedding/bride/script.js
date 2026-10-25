/* Shamshad Shaduli & Raja Jabir — Wedding invitation interactivity */
(function () {
  "use strict";

  const entry    = document.getElementById("entry");
  const envelope = document.getElementById("envelope");
  const invite   = document.getElementById("invite");
  const openBtn  = document.getElementById("open-invitation");
  const audio    = document.getElementById("bg-audio");
  const audioBtn = document.getElementById("audio-toggle");
  const calBtn   = document.getElementById("add-calendar");
  const countdown = document.getElementById("countdown");
  const countdownComplete = document.getElementById("countdown-complete");

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let opened = false;
  let audioStarted = false;

  /* ---------- Start the nasheed (user gesture allows playback) ---------- */
  // In-app browsers (WhatsApp / Instagram / Facebook) frequently reject the
  // first play() even with a gesture, so we don't give up: startAudio() is
  // retried on every real activation gesture (see the unlock listeners below)
  // until one attempt actually begins playback.
  function startAudio() {
    if (!audio || audioStarted) return;
    audio.volume = 0.7; // ignored on most mobile browsers, honoured on desktop
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        audioStarted = true;
        audioBtn && audioBtn.setAttribute("aria-pressed", "false");
        audioBtn && audioBtn.setAttribute("aria-label", "Mute music");
        detachAudioUnlock();
      }).catch(() => {
        // Blocked — reflect muted state; the unlock listeners stay attached so
        // the next gesture retries.
        audioBtn && audioBtn.setAttribute("aria-pressed", "true");
        audioBtn && audioBtn.setAttribute("aria-label", "Play music");
      });
    } else {
      // Legacy browsers where play() returns no promise.
      audioStarted = true;
      detachAudioUnlock();
    }
  }

  /* ---------- Retry playback on real activation gestures ---------- */
  // Only genuine activation gestures unlock audio — scrolling (wheel/touchmove)
  // does NOT — so those are excluded here even though they still open the
  // invitation below.
  const audioUnlockEvents = ["click", "touchstart", "pointerdown", "keydown"];
  function handleAudioUnlock() { startAudio(); }
  function detachAudioUnlock() {
    audioUnlockEvents.forEach((type) =>
      window.removeEventListener(type, handleAudioUnlock)
    );
  }
  if (audio) {
    audioUnlockEvents.forEach((type) =>
      window.addEventListener(type, handleAudioUnlock, { passive: true })
    );
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

  /* ---------- Open on any interaction (scroll, swipe, tap, key) ---------- */
  // The wax seal stays as the visual affordance, but any user action opens it.
  // openInvitation() guards on `opened`, so extra triggers after the first are
  // harmless no-ops; `once` also detaches each listener as it fires.
  function handleOpenTrigger() { openInvitation(); }

  ["click", "wheel", "touchmove", "touchstart", "keydown"].forEach((type) =>
    window.addEventListener(type, handleOpenTrigger, { once: true, passive: true })
  );

  /* ---------- Mute / Unmute ---------- */
  if (audioBtn && audio) {
    audioBtn.addEventListener("click", () => {
      if (audio.paused) {
        const p = audio.play();
        if (p && typeof p.then === "function") {
          p.then(() => {
            audioStarted = true;
            audioBtn.setAttribute("aria-pressed", "false");
            audioBtn.setAttribute("aria-label", "Mute music");
          }).catch(() => {});
        } else {
          audioStarted = true;
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

  /* ---------- Wedding countdown ---------- */
  function updateCountdown() {
    if (!countdown) return;

    const weddingTime = new Date(countdown.dataset.weddingDate).getTime();
    const remaining = weddingTime - Date.now();

    if (!Number.isFinite(weddingTime) || remaining <= 0) {
      countdown.hidden = true;
      if (countdownComplete) countdownComplete.hidden = false;
      return false;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };

    Object.entries(values).forEach(([unit, value]) => {
      const element = countdown.querySelector(`[data-unit="${unit}"]`);
      if (element) element.textContent = String(value).padStart(2, "0");
    });
    countdown.setAttribute(
      "aria-label",
      `${values.days} days, ${values.hours} hours, ${values.minutes} minutes, and ${values.seconds} seconds until the wedding`
    );
    return true;
  }

  if (updateCountdown()) {
    const countdownTimer = window.setInterval(() => {
      if (!updateCountdown()) window.clearInterval(countdownTimer);
    }, 1000);
  }

  /* ---------- Add wedding events to calendar (.ics download) ---------- */
  function pad(n) { return String(n).padStart(2, "0"); }
  function icsEscape(value) {
    return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  }
  function eventLines(event, dtStamp) {
    return [
      "BEGIN:VEVENT",
      "UID:" + event.uid + "@shamshad-raja-wedding",
      "DTSTAMP:" + dtStamp,
      "DTSTART;VALUE=DATE:" + event.start,
      "DTEND;VALUE=DATE:" + event.end,
      "TRANSP:TRANSPARENT",
      "SUMMARY:" + icsEscape(event.title),
      "LOCATION:" + icsEscape(event.location),
      "DESCRIPTION:" + icsEscape(event.description),
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:" + icsEscape(event.title + " is tomorrow"),
      "END:VALARM",
      "END:VEVENT"
    ];
  }
  function icsContent() {
    const d = new Date();
    const dtStamp = d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) +
      "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + "Z";
    const couple = document.body.dataset.couple;
    const reception = document.body.dataset.receptionVenue;
    const side = document.body.dataset.invitation;
    const events = [
      {
        uid: "nikah-20261128",
        start: "20261128", end: "20261129",
        title: "Nikah — " + couple,
        location: "Rifayi Juma Masjid, Cheruthazham",
        description: "Saturday, 28 November 2026, after Asr (India time). This date-only reminder does not specify the ceremony time. Directions to Nikah: https://maps.app.goo.gl/z61tZ2AN4w9ZqBA9A?g_st=iw"
      },
      {
        uid: side + "-reception-20261128",
        start: "20261128", end: "20261129",
        title: "Reception (night) — " + couple,
        location: reception,
        description: "Saturday, 28 November 2026, at night (India time). Exact time to be confirmed."
      },
      {
        uid: side + "-reception-20261129",
        start: "20261129", end: "20261130",
        title: "Reception — " + couple,
        location: reception,
        description: "Sunday, 29 November 2026 (India time). Exact time to be confirmed."
      }
    ];
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Shamshad and Raja//Wedding Invitation//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    events.forEach(event => lines.push(...eventLines(event, dtStamp)));
    lines.push("END:VCALENDAR");
    // Fold at 75 UTF-8 octets, as required for interoperable ICS files.
    const encoder = new TextEncoder();
    return lines.map(line => {
      let folded = "", width = 0;
      for (const char of line) {
        const bytes = encoder.encode(char).length;
        if (width + bytes > 75) { folded += "\r\n "; width = 1; }
        folded += char; width += bytes;
      }
      return folded;
    }).join("\r\n") + "\r\n";
  }

  function downloadICS() {
    const blob = new Blob([icsContent()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Shamshad-Raja-" + document.body.dataset.invitation + "-Wedding.ics";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  if (calBtn) calBtn.addEventListener("click", downloadICS);
})();
