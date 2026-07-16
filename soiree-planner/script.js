const openingNight = new Date("2026-07-31T19:42:00-06:00");

const timerParts = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

function updateCountdown() {
  const remaining = Math.max(0, openingNight.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  const time = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };

  Object.entries(time).forEach(([part, value]) => {
    timerParts[part].textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

const rsvpForm = document.querySelector("#rsvp-form");
const guestList = document.querySelector("#guest-list");
const waitlist = document.querySelector("#waitlist");
const waitlistList = document.querySelector("#waitlist-list");
const confirmedCount = document.querySelector("#confirmed-count");
const spotsRemaining = document.querySelector("#spots-remaining");
const formMessage = document.querySelector("#form-message");
const guestCap = 120;

spotsRemaining.textContent = guestCap - Number(confirmedCount.textContent);

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function createGuestRow(name, attendance, plusOne) {
  const isAttending = attendance === "attending";
  const isWaitlisted = attendance === "waitlisted";
  const row = document.createElement("article");
  row.className = "guest-row";

  const avatar = document.createElement("div");
  avatar.className = `avatar ${isAttending ? "coral" : isWaitlisted ? "gold" : "blush"}`;
  avatar.textContent = getInitials(name);

  const guestName = document.createElement("h3");
  guestName.textContent = name;

  const plusOneDetail = document.createElement("p");
  plusOneDetail.className = "plus-one";
  const plusOneLabel = document.createElement("span");
  plusOneLabel.textContent = "Plus-one";
  plusOneDetail.append(plusOneLabel, plusOne || "No guest");

  const status = document.createElement("span");
  status.className = `status ${isAttending ? "confirmed" : isWaitlisted ? "waitlisted" : "declined"}`;
  status.textContent = isAttending ? "Confirmed" : isWaitlisted ? "Waitlisted" : "Can't attend";

  row.append(avatar, guestName, plusOneDetail, status);
  return row;
}

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(rsvpForm);
  const name = data.get("name").trim();
  const attendance = data.get("attendance");
  const plusOne = data.get("plusOne").trim();

  if (attendance === "attending") {
    const partySize = plusOne ? 2 : 1;
    const currentConfirmed = Number(confirmedCount.textContent);

    if (currentConfirmed + partySize <= guestCap) {
      guestList.prepend(createGuestRow(name, attendance, plusOne));
      const newConfirmed = currentConfirmed + partySize;
      confirmedCount.textContent = newConfirmed;
      spotsRemaining.textContent = guestCap - newConfirmed;
      formMessage.textContent = `Thank you, ${name}. Your party is confirmed.`;
    } else {
      waitlistList.append(createGuestRow(name, "waitlisted", plusOne));
      waitlist.hidden = false;
      formMessage.textContent = `Thank you, ${name}. There isn't enough room for your party, so you joined the waitlist.`;
    }
  } else {
    guestList.prepend(createGuestRow(name, attendance, plusOne));
    formMessage.textContent = `Thank you, ${name}. Your reply is on the list.`;
  }

  rsvpForm.reset();
});
