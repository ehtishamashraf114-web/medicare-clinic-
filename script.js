/**
 * MediCare — Premium Clinic Appointment Website
 * Vanilla JavaScript Core Engine & Interactive Booking Flow
 */

// --- 1. DOCTORS & SPECIALTIES DATASET ---
const CLINIC_DOCTORS = [
  {
    id: 'doc-sarah-alfayed',
    name: 'Dr. Sarah Al-Fayed, MD',
    title: 'Chief Physician & Internal Medicine',
    specialty: 'internal-medicine',
    specialtyLabel: 'Internal Medicine',
    experience: '16 Years Experience',
    rating: 4.98,
    reviewCount: 382,
    fee: 140,
    availability: 'Available Today',
    image: '/src/assets/images/hero_doctor_portrait_1791569728302.jpg',
    bio: 'Specializing in preventative diagnostics, chronic illness management, and patient-centered primary care.'
  },
  {
    id: 'doc-arthur-bennett',
    name: 'Dr. Arthur Bennett, MD, FACC',
    title: 'Senior Consultant Cardiologist',
    specialty: 'cardiology',
    specialtyLabel: 'Cardiology',
    experience: '22 Years Experience',
    rating: 4.96,
    reviewCount: 428,
    fee: 165,
    availability: 'Available Tomorrow',
    image: '/src/assets/images/doctor_cardiology_1791569740653.jpg',
    bio: 'Fellow of the American College of Cardiology. Expert in cardiovascular health, lipid management, and echocardiography.'
  },
  {
    id: 'doc-sarah-jenkins',
    name: 'Dr. Sarah Jenkins, MD, FAAP',
    title: 'Lead Pediatric Specialist',
    specialty: 'pediatrics',
    specialtyLabel: 'Pediatrics',
    experience: '14 Years Experience',
    rating: 4.99,
    reviewCount: 512,
    fee: 130,
    availability: 'Available Today',
    image: '/src/assets/images/doctor_pediatrics_1791569752622.jpg',
    bio: 'Dedicated to compassionate infant, child, and adolescent wellness, developmental assessments, and immunization schedules.'
  },
  {
    id: 'doc-alistair-finch',
    name: 'Dr. Alistair Finch, MD, PhD',
    title: 'Chief of Clinical Neurology',
    specialty: 'neurology',
    specialtyLabel: 'Neurology',
    experience: '19 Years Experience',
    rating: 4.95,
    reviewCount: 295,
    fee: 175,
    availability: 'Available Thursday',
    image: '/src/assets/images/doctor_neurology_1791569763788.jpg',
    bio: 'Specialist in migraine therapies, neuropathy, neurovascular disorders, and cognitive preservation therapies.'
  }
];

const STANDARD_TIME_SLOTS = [
  '08:30 AM', '09:15 AM', '10:00 AM', '10:45 AM',
  '11:30 AM', '01:30 PM', '02:15 PM', '03:00 PM',
  '03:45 PM', '04:30 PM', '05:15 PM'
];

// LocalStorage Key
const STORAGE_KEY = 'medicare_demo_bookings';

// --- STATE MANAGEMENT ---
let appState = {
  selectedSpecialty: 'all',
  bookingDoctorId: CLINIC_DOCTORS[0].id,
  bookingSpecialty: CLINIC_DOCTORS[0].specialty,
  bookingDate: '',
  bookingTimeSlot: '',
  consultationType: 'clinic', // 'clinic' | 'telehealth'
  bookings: []
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  loadBookingsFromStorage();
  initDateDefaults();
  initHeader();
  initHeroStatsCounter();
  initSpecialtyFilter();
  initBookingForm();
  initModals();
  initFaqAccordion();
  initScrollReveals();
  updateHeaderBadge();
});

// --- LOCAL STORAGE HELPERS ---
function loadBookingsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      appState.bookings = JSON.parse(raw);
    } else {
      // Seed one realistic initial appointment if empty to demonstrate functionality
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 2);
      const seedBooking = {
        id: 'MC-84912',
        doctorName: 'Dr. Sarah Jenkins, MD, FAAP',
        specialtyLabel: 'Pediatrics',
        date: defaultDate.toISOString().split('T')[0],
        timeSlot: '10:00 AM',
        consultationType: 'In-Person Clinic',
        patientName: 'Emma Roberts',
        patientEmail: 'emma.roberts@example.com',
        patientPhone: '+1 (555) 234-5678',
        reason: 'Annual pediatric health & development checkup',
        createdAt: new Date().toISOString()
      };
      appState.bookings = [seedBooking];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.bookings));
    }
  } catch (err) {
    console.error('Failed to load local bookings:', err);
    appState.bookings = [];
  }
}

function saveBookingsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.bookings));
    updateHeaderBadge();
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

function updateHeaderBadge() {
  const badge = document.getElementById('myBookingsCount');
  if (badge) {
    const count = appState.bookings.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

// --- DATE SELECTION DEFAULTS ---
function initDateDefaults() {
  const dateInput = document.getElementById('appointmentDate');
  if (!dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  
  const minDateStr = `${yyyy}-${mm}-${dd}`;
  dateInput.min = minDateStr;
  
  // Set default to tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomMm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const tomDd = String(tomorrow.getDate()).padStart(2, '0');
  const defaultDateStr = `${tomorrow.getFullYear()}-${tomMm}-${tomDd}`;
  
  dateInput.value = defaultDateStr;
  appState.bookingDate = defaultDateStr;
}

// --- HEADER SCROLL & MOBILE NAVIGATION ---
function initHeader() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.getElementById('mobileNavDrawer');

  // Sticky shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 24) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('is-open');
      if (isOpen) {
        drawer.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        drawer.classList.add('is-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close on link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll offset handling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = 84;
        const elemPos = targetElem.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elemPos - headerOffset,
          behavior: 'smooth'
        });
      }
    });
  });
}

// --- ANIMATED COUNTER ON SCROLL ---
function initHeroStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const rawTarget = parseFloat(target.getAttribute('data-target') || '0');
        const decimals = target.getAttribute('data-decimals') === 'true';
        const suffix = target.getAttribute('data-suffix') || '';
        
        animateCount(target, 0, rawTarget, 1600, decimals, suffix);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(elem => observer.observe(elem));
}

function animateCount(elem, start, end, duration, decimals, suffix) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out cubic curve
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = start + (end - start) * easeProgress;
    
    if (decimals) {
      elem.innerHTML = `${currentVal.toFixed(1)}<span class="stat-suffix">${suffix}</span>`;
    } else {
      elem.innerHTML = `${Math.floor(currentVal).toLocaleString()}<span class="stat-suffix">${suffix}</span>`;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// --- SPECIALTIES DOCTOR FILTER ---
function initSpecialtyFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const doctorCards = document.querySelectorAll('.doctor-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const specialty = btn.getAttribute('data-filter');
      appState.selectedSpecialty = specialty;

      doctorCards.forEach(card => {
        const cardSpecialty = card.getAttribute('data-specialty');
        if (specialty === 'all' || cardSpecialty === specialty) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --- INTERACTIVE APPOINTMENT BOOKING ENGINE ---
function initBookingForm() {
  const specialtySelect = document.getElementById('bookingSpecialty');
  const doctorSelect = document.getElementById('bookingDoctor');
  const dateInput = document.getElementById('appointmentDate');
  const slotsContainer = document.getElementById('timeSlotsContainer');
  const consultCards = document.querySelectorAll('.consult-type-card');
  const bookingForm = document.getElementById('appointmentForm');

  if (!bookingForm) return;

  // Populate doctor select based on specialty
  function updateDoctorOptions(selectedSpecialty) {
    if (!doctorSelect) return;
    doctorSelect.innerHTML = '';

    const filteredDocs = selectedSpecialty === 'all' 
      ? CLINIC_DOCTORS 
      : CLINIC_DOCTORS.filter(d => d.specialty === selectedSpecialty);

    filteredDocs.forEach(doc => {
      const opt = document.createElement('option');
      opt.value = doc.id;
      opt.textContent = `${doc.name} — ${doc.specialtyLabel}`;
      doctorSelect.appendChild(opt);
    });

    if (filteredDocs.length > 0) {
      doctorSelect.value = filteredDocs[0].id;
      appState.bookingDoctorId = filteredDocs[0].id;
    }
    updateQuickDoctorPreview();
    renderTimeSlots();
  }

  // Update quick doctor preview card inside booking panel
  function updateQuickDoctorPreview() {
    const doc = CLINIC_DOCTORS.find(d => d.id === appState.bookingDoctorId);
    if (!doc) return;

    const avatar = document.getElementById('docPreviewAvatar');
    const name = document.getElementById('docPreviewName');
    const dept = document.getElementById('docPreviewDept');

    if (avatar) avatar.src = doc.image;
    if (name) name.textContent = doc.name;
    if (dept) dept.textContent = doc.specialtyLabel;
  }

  // Render Time Slots based on chosen Doctor & Date
  function renderTimeSlots() {
    if (!slotsContainer) return;
    slotsContainer.innerHTML = '';

    // Deterministic simulation: disable a couple slots based on date string hash to feel authentic
    const dateStr = dateInput?.value || '2026-10-10';
    const hash = dateStr.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);

    let hasSelected = false;

    STANDARD_TIME_SLOTS.forEach((slot, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot-btn';
      btn.textContent = slot;

      // Deterministically disable 2 slots per day
      const isBooked = ((idx + hash) % 5 === 0);
      if (isBooked) {
        btn.disabled = true;
        btn.title = 'Slot already reserved';
      } else {
        if (!hasSelected && (!appState.bookingTimeSlot || appState.bookingTimeSlot === slot)) {
          btn.classList.add('selected');
          appState.bookingTimeSlot = slot;
          hasSelected = true;
        }

        btn.addEventListener('click', () => {
          slotsContainer.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          appState.bookingTimeSlot = slot;
          clearFieldError('timeSlot');
        });
      }

      slotsContainer.appendChild(btn);
    });

    if (!hasSelected) {
      // Pick first non-disabled slot
      const firstAvailable = slotsContainer.querySelector('.slot-btn:not(:disabled)');
      if (firstAvailable) {
        firstAvailable.classList.add('selected');
        appState.bookingTimeSlot = firstAvailable.textContent;
      }
    }
  }

  // Event: Specialty changed
  specialtySelect?.addEventListener('change', (e) => {
    appState.bookingSpecialty = e.target.value;
    updateDoctorOptions(e.target.value);
  });

  // Event: Doctor changed
  doctorSelect?.addEventListener('change', (e) => {
    appState.bookingDoctorId = e.target.value;
    const doc = CLINIC_DOCTORS.find(d => d.id === e.target.value);
    if (doc && specialtySelect) {
      specialtySelect.value = doc.specialty;
      appState.bookingSpecialty = doc.specialty;
    }
    updateQuickDoctorPreview();
    renderTimeSlots();
  });

  // Event: Date changed
  dateInput?.addEventListener('change', (e) => {
    appState.bookingDate = e.target.value;
    renderTimeSlots();
  });

  // Consultation Type Toggle
  consultCards.forEach(card => {
    card.addEventListener('click', () => {
      consultCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      appState.consultationType = card.getAttribute('data-type') || 'clinic';
    });
  });

  // Initial runs
  updateDoctorOptions('all');

  // Connect Doctor Cards "Book Appointment" buttons
  document.querySelectorAll('.btn-book-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-doc-id');
      preSelectDoctorAndScroll(docId);
    });
  });

  // Connect Service Cards "Book for this Specialty" buttons
  document.querySelectorAll('.btn-service-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const spec = btn.getAttribute('data-spec');
      if (spec) {
        if (specialtySelect) {
          specialtySelect.value = spec;
          appState.bookingSpecialty = spec;
          updateDoctorOptions(spec);
        }
        scrollToBooking();
      }
    });
  });

  // Booking Form Submission & Validation
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateBookingForm()) {
      openReviewConfirmationModal();
    }
  });

  // Real-time Input Validation clearers
  ['patientName', 'patientEmail', 'patientPhone'].forEach(id => {
    const input = document.getElementById(id);
    input?.addEventListener('input', () => {
      clearFieldError(id);
    });
  });
}

// --- FORM VALIDATION ---
function validateBookingForm() {
  let isValid = true;

  const nameInput = document.getElementById('patientName');
  const emailInput = document.getElementById('patientEmail');
  const phoneInput = document.getElementById('patientPhone');
  const dateInput = document.getElementById('appointmentDate');

  // Name validation
  if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
    setFieldError('patientName', 'Please enter your full legal name (minimum 3 letters).');
    isValid = false;
  } else {
    clearFieldError('patientName');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
    setFieldError('patientEmail', 'Please enter a valid email address for appointment confirmation.');
    isValid = false;
  } else {
    clearFieldError('patientEmail');
  }

  // Phone validation
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  const cleanPhone = phoneInput.value.replace(/[\s\(\)\-\.]/g, '');
  if (!phoneInput.value.trim() || cleanPhone.length < 10) {
    setFieldError('patientPhone', 'Please enter a valid contact phone number with area code.');
    isValid = false;
  } else {
    clearFieldError('patientPhone');
  }

  // Date validation
  if (!dateInput.value) {
    setFieldError('appointmentDate', 'Please select an appointment date.');
    isValid = false;
  } else {
    clearFieldError('appointmentDate');
  }

  // Time slot validation
  if (!appState.bookingTimeSlot) {
    setFieldError('timeSlot', 'Please select an available appointment time slot.');
    isValid = false;
  } else {
    clearFieldError('timeSlot');
  }

  return isValid;
}

function setFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorMsg = document.getElementById(`${fieldId}Error`);
  if (input) input.classList.add('has-error');
  if (errorMsg) {
    errorMsg.textContent = message;
    errorMsg.classList.add('visible');
  }
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorMsg = document.getElementById(`${fieldId}Error`);
  if (input) input.classList.remove('has-error');
  if (errorMsg) {
    errorMsg.textContent = '';
    errorMsg.classList.remove('visible');
  }
}

function preSelectDoctorAndScroll(docId) {
  const doctorSelect = document.getElementById('bookingDoctor');
  const specialtySelect = document.getElementById('bookingSpecialty');
  const doc = CLINIC_DOCTORS.find(d => d.id === docId);

  if (doc) {
    appState.bookingDoctorId = doc.id;
    appState.bookingSpecialty = doc.specialty;
    if (specialtySelect) specialtySelect.value = doc.specialty;
    
    // Refresh doctor options
    if (doctorSelect) {
      doctorSelect.innerHTML = '';
      CLINIC_DOCTORS.filter(d => d.specialty === doc.specialty).forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.name} — ${d.specialtyLabel}`;
        doctorSelect.appendChild(opt);
      });
      doctorSelect.value = doc.id;
    }

    // Update avatar and preview
    const avatar = document.getElementById('docPreviewAvatar');
    const name = document.getElementById('docPreviewName');
    const dept = document.getElementById('docPreviewDept');
    if (avatar) avatar.src = doc.image;
    if (name) name.textContent = doc.name;
    if (dept) dept.textContent = doc.specialtyLabel;
  }

  scrollToBooking();
}

function scrollToBooking() {
  const bookingSec = document.getElementById('booking');
  if (bookingSec) {
    const headerOffset = 84;
    const elemPos = bookingSec.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elemPos - headerOffset,
      behavior: 'smooth'
    });
  }
}

// --- MODALS (REVIEW, CONFIRMATION & MY BOOKINGS) ---
function initModals() {
  // Close buttons handler
  document.querySelectorAll('.btn-modal-close, [data-modal-dismiss]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });

  // ESC key closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Backdrop click closes
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // Header "My Bookings" button
  const myBookingsBtn = document.getElementById('btnOpenMyBookings');
  if (myBookingsBtn) {
    myBookingsBtn.addEventListener('click', openMyBookingsModal);
  }

  // Footer "My Scheduled Appointments" link
  const footerMyBookings = document.getElementById('footerMyBookingsTrigger');
  if (footerMyBookings) {
    footerMyBookings.addEventListener('click', (e) => {
      e.preventDefault();
      openMyBookingsModal();
    });
  }

  // Copy Clinic Address button
  const copyAddressBtn = document.getElementById('btnCopyAddress');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const addressText = '450 Health Avenue, Suite 300, Medical District, NY 10016';
      navigator.clipboard?.writeText(addressText).then(() => {
        showToast('Address copied to clipboard!');
      }).catch(() => {
        showToast('Address copied: 450 Health Avenue, Suite 300');
      });
    });
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('is-active'));
  document.body.style.overflow = '';
}

// Open Review Modal
function openReviewConfirmationModal() {
  const modal = document.getElementById('reviewModal');
  if (!modal) return;

  const doc = CLINIC_DOCTORS.find(d => d.id === appState.bookingDoctorId) || CLINIC_DOCTORS[0];
  const nameVal = document.getElementById('patientName').value.trim();
  const emailVal = document.getElementById('patientEmail').value.trim();
  const phoneVal = document.getElementById('patientPhone').value.trim();
  const reasonVal = document.getElementById('patientReason')?.value.trim() || 'General consultation & health review';
  const consultTypeStr = appState.consultationType === 'telehealth' ? 'Virtual Video Telehealth' : 'In-Person Clinic Visit';

  // Format date nicely
  const dateObj = new Date(appState.bookingDate + 'T00:00:00');
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Populate Review Slip
  document.getElementById('reviewDocName').textContent = doc.name;
  document.getElementById('reviewDocSpecialty').textContent = doc.specialtyLabel;
  document.getElementById('reviewDate').textContent = dateFormatted;
  document.getElementById('reviewTime').textContent = appState.bookingTimeSlot;
  document.getElementById('reviewType').textContent = consultTypeStr;
  document.getElementById('reviewPatient').textContent = nameVal;
  document.getElementById('reviewContact').textContent = `${emailVal} · ${phoneVal}`;
  document.getElementById('reviewReason').textContent = reasonVal;

  modal.classList.add('is-active');
  document.body.style.overflow = 'hidden';

  // Hook up confirm button in review modal
  const confirmBtn = document.getElementById('btnConfirmBookingFinal');
  confirmBtn.onclick = () => {
    executeBookingSubmission(doc, nameVal, emailVal, phoneVal, reasonVal, consultTypeStr, dateFormatted);
  };
}

// Execute Booking Submission
function executeBookingSubmission(doc, name, email, phone, reason, consultTypeStr, dateFormatted) {
  const confirmBtn = document.getElementById('btnConfirmBookingFinal');
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Securing Slot...
    `;
  }

  // Simulate smooth 450ms network settling
  setTimeout(() => {
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = 'Confirm & Finalize Appointment';
    }
    closeAllModals();

    const bookingRef = 'MC-' + Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      id: bookingRef,
      doctorId: doc.id,
      doctorName: doc.name,
      specialtyLabel: doc.specialtyLabel,
      date: appState.bookingDate,
      dateFormatted: dateFormatted,
      timeSlot: appState.bookingTimeSlot,
      consultationType: consultTypeStr,
      patientName: name,
      patientEmail: email,
      patientPhone: phone,
      reason: reason,
      createdAt: new Date().toISOString()
    };

    appState.bookings.unshift(newBooking);
    saveBookingsToStorage();

    // Show Success Modal
    openSuccessModal(newBooking);
  }, 450);
}

// Open Success Confirmation Modal
function openSuccessModal(booking) {
  const modal = document.getElementById('successModal');
  if (!modal) return;

  document.getElementById('successRefCode').textContent = booking.id;
  document.getElementById('successDocName').textContent = booking.doctorName;
  document.getElementById('successDept').textContent = booking.specialtyLabel;
  document.getElementById('successDate').textContent = `${booking.dateFormatted} at ${booking.timeSlot}`;
  document.getElementById('successType').textContent = booking.consultationType;
  document.getElementById('successPatient').textContent = booking.patientName;

  // Add to Calendar trigger
  const calBtn = document.getElementById('btnDownloadCalendar');
  if (calBtn) {
    calBtn.onclick = () => {
      generateIcsFile(booking);
    };
  }

  modal.classList.add('is-active');
  document.body.style.overflow = 'hidden';

  // Reset form inputs
  const form = document.getElementById('appointmentForm');
  if (form) {
    document.getElementById('patientName').value = '';
    document.getElementById('patientEmail').value = '';
    document.getElementById('patientPhone').value = '';
    if (document.getElementById('patientReason')) document.getElementById('patientReason').value = '';
  }
}

// Generate real downloadable .ICS calendar invite
function generateIcsFile(booking) {
  const dateStr = booking.date.replace(/-/g, '');
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MediCare Clinic//Appointment Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:MediCare Appointment: ${booking.doctorName}`,
    `DESCRIPTION:Appointment Reference: ${booking.id}\\nSpecialty: ${booking.specialtyLabel}\\nType: ${booking.consultationType}\\nPatient: ${booking.patientName}`,
    'LOCATION:MediCare Clinic, 450 Health Avenue, Suite 300, Medical District',
    `DTSTART:${dateStr}T100000Z`,
    `DTEND:${dateStr}T104500Z`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `medicare-appointment-${booking.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Calendar appointment (.ics) downloaded!');
}

// Open "My Bookings" List Modal
function openMyBookingsModal() {
  const modal = document.getElementById('myBookingsModal');
  const container = document.getElementById('myBookingsListContainer');
  if (!modal || !container) return;

  container.innerHTML = '';

  if (appState.bookings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 16px; color: var(--text-muted);">
        <p style="font-weight: 600; font-size: 1.05rem; margin-bottom: 8px; color: var(--primary-navy);">No appointments scheduled yet</p>
        <p style="font-size: 0.875rem;">Your confirmed appointments will appear here with calendar download and cancellation options.</p>
      </div>
    `;
  } else {
    appState.bookings.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'my-booking-card';
      card.innerHTML = `
        <div class="my-booking-header">
          <div>
            <div class="my-booking-doc">${item.doctorName}</div>
            <div style="font-size: 0.775rem; color: var(--emerald-primary); font-weight: 700;">${item.specialtyLabel} · ${item.consultationType}</div>
          </div>
          <span style="font-family: var(--font-display); font-size: 0.85rem; font-weight: 800; color: var(--primary-navy); background: var(--surface-alt); padding: 4px 8px; border-radius: var(--radius-xs); border: 1px solid var(--border-hairline);">
            ${item.id}
          </span>
        </div>
        <div class="my-booking-date">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${item.dateFormatted || item.date} at <strong>${item.timeSlot}</strong></span>
        </div>
        <div class="my-booking-actions">
          <button type="button" class="btn-cal-mini" style="font-size: 0.8rem; font-weight: 600; color: var(--emerald-dark); display: inline-flex; align-items: center; gap: 4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Save .ics
          </button>
          <button type="button" class="btn-cancel-appt" data-index="${index}">
            Cancel Appointment
          </button>
        </div>
      `;

      // Cancel button event
      card.querySelector('.btn-cancel-appt').addEventListener('click', () => {
        cancelAppointment(index);
      });

      // Mini Calendar download event
      card.querySelector('.btn-cal-mini').addEventListener('click', () => {
        generateIcsFile(item);
      });

      container.appendChild(card);
    });
  }

  modal.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

function cancelAppointment(index) {
  if (confirm('Are you sure you want to cancel this appointment slot?')) {
    const cancelled = appState.bookings.splice(index, 1);
    saveBookingsToStorage();
    openMyBookingsModal(); // Re-render
    showToast(`Appointment ${cancelled[0]?.id || ''} cancelled.`);
  }
}

// --- FAQ ACCORDION ---
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    trigger?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all
      items.forEach(other => {
        other.classList.remove('is-open');
        const otherPanel = other.querySelector('.faq-panel');
        const otherTrigger = other.querySelector('.faq-trigger');
        if (otherPanel) otherPanel.style.maxHeight = null;
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        if (panel) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      }
    });
  });

  // Open the first FAQ by default
  if (items.length > 0) {
    const firstItem = items[0];
    const firstTrigger = firstItem.querySelector('.faq-trigger');
    const firstPanel = firstItem.querySelector('.faq-panel');
    firstItem.classList.add('is-open');
    firstTrigger?.setAttribute('aria-expanded', 'true');
    if (firstPanel) {
      firstPanel.style.maxHeight = firstPanel.scrollHeight + 'px';
    }
  }
}

// --- SCROLL REVEALS VIA INTERSECTION OBSERVER ---
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(el => observer.observe(el));
}

// --- TOAST NOTIFICATIONS ---
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-success';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, 3200);
}
