/* =========================================================
   SHARED ENQUIRY MODAL
========================================================= */

document.addEventListener("DOMContentLoaded", async function () {
  const modalContainer = document.getElementById("enquiryModalContainer");

  if (!modalContainer) {
    return;
  }

  try {
    const response = await fetch("components/enquiry-modal.html");

    if (!response.ok) {
      throw new Error("Failed to load enquiry modal.");
    }

    modalContainer.innerHTML = await response.text();

    initializeEnquiryForm();
  } catch (error) {
    console.error("Enquiry modal loading error:", error);
  }
});

function initializeEnquiryForm() {
  const enquiryForm = document.getElementById("enquiryForm");
  const checkInInput = document.getElementById("checkInDate");
  const checkOutInput = document.getElementById("checkOutDate");

  if (!enquiryForm || !checkInInput || !checkOutInput) {
    return;
  }

  const whatsappNumber = "919718188344";

  function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const today = getLocalDateString(new Date());

  checkInInput.min = today;
  checkOutInput.min = today;

  checkInInput.addEventListener("change", function () {
    if (!checkInInput.value) return;

    const checkInDate = new Date(checkInInput.value + "T00:00:00");
    checkInDate.setDate(checkInDate.getDate() + 1);

    const minimumCheckout = getLocalDateString(checkInDate);

    checkOutInput.min = minimumCheckout;

    if (checkOutInput.value && checkOutInput.value < minimumCheckout) {
      checkOutInput.value = "";
    }
  });

  enquiryForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!enquiryForm.checkValidity()) {
      enquiryForm.reportValidity();
      return;
    }

    const guestName = document.getElementById("guestName").value.trim();
    const guestPhone = document.getElementById("guestPhone").value.trim();
    const checkInDate = checkInInput.value;
    const checkOutDate = checkOutInput.value;

    if (checkOutDate <= checkInDate) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    const message = `
Hello Aamche Villa,

I would like to enquire about a stay.

Name: ${guestName}
Phone: ${guestPhone}
Check-in: ${checkInDate}
Check-out: ${checkOutDate}

Please share availability and your direct booking offer.

Thank you.
    `.trim();

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });
}
