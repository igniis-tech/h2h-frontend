
// // src/components/BookingForm.jsx
// import React, { useEffect, useMemo, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import {
//   createBooking,
//   createOrder,
//   openPaymentLink,
//   downloadTicket,
// } from '../api';
// import { useAuth } from '../state/AuthContext';

// const API_BASE = (import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api/').replace(/\/+$/, '');

// // --- helpers ---
// const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
// const uc = (s) => (s || '').toUpperCase();

// // keep exact code user typed (only trim ends)
// async function fetchPromoPreview({ code, package_id, amount_inr }) {
//   const url = new URL(`${API_BASE}/promocodes/validate`);
//   url.searchParams.set('code', code.trim()); // DO NOT strip spaces
//   url.searchParams.set('package_id', String(package_id));
//   if (amount_inr != null) url.searchParams.set('amount_inr', String(amount_inr));
//   const res = await fetch(url.toString(), { credentials: 'include' });
//   if (!res.ok) throw new Error('Promo validate failed');
//   return res.json();
// }

// // function computePricing(pkg, companions, promoPreview) {
// //   if (!pkg) return null;

// //   const baseIncludes = Number(pkg.base_includes ?? 1) || 1; // base includes the primary
// //   const basePrice = Number(pkg.price_inr ?? 0) || 0;
// //   const extraAdultPrice = Number(pkg.extra_price_adult_inr ?? 0) || 0;
// //   const childFreeMax = Number(pkg.child_free_max_age ?? 0);
// //   const childHalfMax = Number(pkg.child_half_max_age ?? 0);
// //   const halfMult = Number(pkg.child_half_multiplier ?? 0.5);

// //   const totalGuests = 1 + (companions?.length || 0);

// //   // Classify companions only; primary is included in base
// //   let adults = 0, half = 0, free = 0;
// //   (companions || []).forEach(c => {
// //     const age = Number(c.age);
// //     if (!Number.isFinite(age)) { adults += 1; return; }
// //     if (age <= childFreeMax) free += 1;
// //     else if (age <= childHalfMax) half += 1;
// //     else adults += 1;
// //   });

// //   // How many beyond base?
// //   const extrasCount = Math.max(0, totalGuests - baseIncludes);
// //   const chargeableAdults = Math.min(adults, extrasCount);
// //   const remainAfterAdults = Math.max(0, extrasCount - chargeableAdults);
// //   const chargeableHalf = Math.min(half, remainAfterAdults);

// //   const extrasAdultInr = chargeableAdults * extraAdultPrice;
// //   const extrasHalfInr = chargeableHalf * (extraAdultPrice * halfMult);
// //   const extrasInr = Math.round(extrasAdultInr + extrasHalfInr);

// //   const subtotal = basePrice + extrasInr;

// //   // Apply promo preview if available
// //   let discount = 0, total = subtotal;
// //   if (promoPreview?.valid) {
// //     if (typeof promoPreview.final_inr === 'number') {
// //       total = promoPreview.final_inr;
// //       discount = Math.max(0, subtotal - total);
// //     } else if (typeof promoPreview.discount_inr === 'number') {
// //       discount = Math.max(0, promoPreview.discount_inr);
// //       total = Math.max(0, subtotal - discount);
// //     }
// //   }

// //   return {
// //     base_inr: basePrice,
// //     extra_adults_count: chargeableAdults,
// //     extra_half_count: chargeableHalf,
// //     free_count: free,
// //     extras_inr: extrasInr,
// //     subtotal_inr: subtotal,
// //     discount_inr: discount,
// //     total_inr: total,
// //   };
// // }

// function computePricing(pkg, companions, promoPreview) {
//   if (!pkg) return null;

//   const baseIncludes = Number(pkg.base_includes ?? 1) || 1; // base includes the primary
//   const basePrice = Number(pkg.price_inr ?? 0) || 0;
//   const extraAdultPrice = Number(pkg.extra_price_adult_inr ?? 0) || 0;
//   const childFreeMax = Number(pkg.child_free_max_age ?? 0);
//   const childHalfMax = Number(pkg.child_half_max_age ?? 0);
//   const halfMult = Number(pkg.child_half_multiplier ?? 0.5);

//   const totalGuests = 1 + (companions?.length || 0);

//   // Companions only; primary is included in base
//   let adults = 0, half = 0, free = 0;
//   (companions || []).forEach(c => {
//     const age = Number(c.age);
//     if (!Number.isFinite(age)) { adults += 1; return; }
//     if (age <= childFreeMax) free += 1;
//     else if (age <= childHalfMax) half += 1;
//     else adults += 1;
//   });

//   // Beyond base?
//   const extrasCount = Math.max(0, totalGuests - baseIncludes);
//   const chargeableAdults = Math.min(adults, extrasCount);
//   const remainAfterAdults = Math.max(0, extrasCount - chargeableAdults);
//   const chargeableHalf = Math.min(half, remainAfterAdults);

//   const extras_adults_inr = chargeableAdults * extraAdultPrice;
//   const extras_half_inr = chargeableHalf * (extraAdultPrice * halfMult);
//   const extras_inr = Math.round(extras_adults_inr + extras_half_inr);

//   const subtotal = basePrice + extras_inr;

//   // Promo (if previewed)
//   let discount = 0, total = subtotal;
//   if (promoPreview?.valid) {
//     if (typeof promoPreview.final_inr === 'number') {
//       total = promoPreview.final_inr;
//       discount = Math.max(0, subtotal - total);
//     } else if (typeof promoPreview.discount_inr === 'number') {
//       discount = Math.max(0, promoPreview.discount_inr);
//       total = Math.max(0, subtotal - discount);
//     }
//   }

//   return {
//     base_inr: basePrice,
//     extra_adults_count: chargeableAdults,
//     extra_half_count: chargeableHalf,
//     free_count: free,
//     extras_adults_inr,
//     extras_half_inr,
//     extras_inr,
//     subtotal_inr: subtotal,
//     discount_inr: discount,
//     total_inr: total,
//   };
// }


// export default function BookingForm() {
//   const { token, profile } = useAuth();
//   const location = useLocation();
//   const pkgIdFromNav = (location.state && location.state.package_id) || null;
//   const pkgNameFromNav = (location.state && location.state.package) || '';

//   const [step, setStep] = useState(0);
//   const [saving, setSaving] = useState(false);
//   const [result, setResult] = useState(null);
//   const [msg, setMsg] = useState('');

//   const [eventInfo, setEventInfo] = useState(null);
//   const [packageInfo, setPackageInfo] = useState(null);

//   const [availability, setAvailability] = useState(null);
//   const [unitTypes, setUnitTypes] = useState([]);
//   const [selectedUnitTypeId, setSelectedUnitTypeId] = useState(null);

//   const [promoCode, setPromoCode] = useState('');
//   const [promoPreview, setPromoPreview] = useState(null); // moved to Details step

//   const [form, setForm] = useState({
//     // display/context
//     package_id: pkgIdFromNav,
//     package: pkgNameFromNav || 'Tent',
//     notes: '',

//     // primary person
//     name: '',
//     email: '',
//     phone: '',
//     blood_group: '',
//     primary_age: '',

//     // companions moved to Package step
//     companions: [],

//     // backend slice (hidden)
//     event_id: Number(import.meta.env.VITE_DEFAULT_EVENT_ID || 1),
//     property_id: Number(import.meta.env.VITE_DEFAULT_PROPERTY_ID || 1),
//     category: (import.meta.env.VITE_DEFAULT_CATEGORY || pkgNameFromNav || 'TENT').toUpperCase(),
//   });

//   // ----- Prefill user details -----
//   useEffect(() => {
//     let info = profile;
//     if (!info) {
//       try { info = JSON.parse(localStorage.getItem('user_info') || 'null'); } catch { }
//       if (!info) { try { info = JSON.parse(sessionStorage.getItem('user_info') || 'null'); } catch { } }
//     }
//     if (info) {
//       const name = info.name || [info.given_name, info.family_name].filter(Boolean).join(' ') || '';
//       const email = info.email || info.username || '';
//       const phone = info.phone_number || info.phone || '';
//       setForm(f => ({
//         ...f,
//         name: f.name || name,
//         email: f.email || email,
//         phone: f.phone || phone,
//       }));
//     }
//   }, [profile]);

//   // ----- Load event + packages -----
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/packages`, { credentials: 'include' });
//         const data = await res.json();

//         const eventObj = data?.event || null;
//         const pkgs = data?.packages || (Array.isArray(data) ? data : []) || [];
//         let pkg = null;
//         if (pkgIdFromNav) pkg = pkgs.find(p => Number(p.id) === Number(pkgIdFromNav)) || null;
//         if (!pkg && pkgs.length) pkg = pkgs[0];

//         if (!alive) return;

//         setEventInfo(eventObj);
//         if (eventObj?.id) setForm((f) => ({ ...f, event_id: Number(eventObj.id) }));

//         if (pkg) {
//           setPackageInfo(pkg);
//           setForm((f) => ({
//             ...f,
//             package_id: Number(pkg.id),
//             package: pkg.name || f.package,
//             category: uc(pkg.name || f.category),
//           }));
//         }
//       } catch (e) {
//         console.error('[Booking] fetch /packages failed', e);
//       }
//     })();
//     return () => { alive = false; };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ----- Auto-check availability when event/package changes -----
//   useEffect(() => {
//     let alive = true;
//     async function run() {
//       if (!form.event_id || !form.package_id) return;
//       setMsg('Checking availability…');
//       try {
//         const u = new URL(`${API_BASE}/inventory/availability`);
//         u.searchParams.set('event_id', String(form.event_id));
//         u.searchParams.set('package_id', String(form.package_id));
//         const res = await fetch(u.toString(), { credentials: 'include' });
//         const data = await res.json();
//         if (!alive) return;

//         setAvailability(data);
//         save('last_availability', data);

//         const allowed = data?.package?.allowed_unit_types || [];
//         setUnitTypes(allowed);
//         if (allowed.length) {
//           setSelectedUnitTypeId((prev) =>
//             prev && allowed.some(x => Number(x.id) === Number(prev)) ? prev : Number(allowed[0].id)
//           );
//         }
//         setMsg(`Available: ${data.available_units} (capacity ${data.total_capacity})`);
//       } catch (e) {
//         console.error(e);
//         setMsg('Availability check failed.');
//       }
//     }
//     run();
//     return () => { alive = false; };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [form.event_id, form.package_id]);

//   // ----- Pricing (uses promoPreview only on Details step) -----
//   const pricing = useMemo(() => {
//     return computePricing(packageInfo, form.companions, promoPreview);
//   }, [packageInfo, form.companions, promoPreview]);

//   // ----- Companions edit helpers (now on Package step) -----
//   const addCompanion = () =>
//     setForm(f => ({ ...f, companions: [...(f.companions || []), { name: '', age: '', blood_group: '' }] }));
//   const removeCompanion = (idx) =>
//     setForm(f => ({ ...f, companions: f.companions.filter((_, i) => i !== idx) }));
//   const editCompanion = (idx, key, value) =>
//     setForm(f => {
//       const arr = [...(f.companions || [])];
//       arr[idx] = { ...arr[idx], [key]: value };
//       return { ...f, companions: arr };
//     });

//   // ----- Step guards -----
//   const canNext = useMemo(() => {
//     if (step === 0) return Boolean(eventInfo) && String(form.primary_age).trim() !== '';
//     if (step === 1) return Boolean(form.package_id) && Boolean(selectedUnitTypeId);
//     if (step === 2) return Boolean(form.name) && Boolean(form.email) && Boolean(form.phone);
//     return true;
//   }, [step, form, eventInfo, selectedUnitTypeId]);

//   const next = () => setStep((s) => Math.min(s + 1, 3));
//   const prev = () => setStep((s) => Math.max(s - 1, 0));
//   const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   // ----- Promo & Pricing (now on Details step) -----
//   const previewPromo = async () => {
//     if (!promoCode.trim() || !packageInfo) { setPromoPreview(null); return; }
//     try {
//       // Preview against subtotal (base + extras) with current companions
//       const approxAmount = computePricing(packageInfo, form.companions, null)?.subtotal_inr ?? packageInfo.price_inr ?? 0;
//       setMsg('Checking promo…');
//       const data = await fetchPromoPreview({
//         code: promoCode, // keep spaces
//         package_id: form.package_id,
//         amount_inr: approxAmount,
//       });
//       setPromoPreview(data);
//       save('last_promo', data);
//       setMsg('Promo looks good.');
//     } catch (e) {
//       console.error(e);
//       setPromoPreview(null);
//       setMsg('Promo invalid or expired.');
//     }
//   };

//   // ----- Submit -----
//   async function submit() {
//     setSaving(true);
//     setMsg('Creating booking…');
//     try {
//       const payload = {
//         event_id: Number(form.event_id),
//         property_id: Number(form.property_id),
//         unit_type_id: Number(selectedUnitTypeId),
//         category: uc(packageInfo?.name || form.category),

//         package_id: Number(form.package_id),
//         promo_code: promoCode.trim() || undefined,

//         blood_group: uc(form.blood_group).slice(0, 5),
//         emergency_contact_name: (form.name || '').trim(),
//         emergency_contact_phone: (form.phone || '').trim().slice(0, 32),

//         primary_age: form.primary_age === '' ? undefined : Number(form.primary_age),

//         companions: (form.companions || [])
//           .map(c => ({
//             name: (c.name || '').trim(),
//             age: c.age === '' ? undefined : Number(c.age),
//             blood_group: uc(c.blood_group).slice(0, 5),
//           }))
//           .filter(c => c.name),
//       };

//       Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

//       const booking = await createBooking(payload);
//       save('last_booking', booking);
//       setMsg('Booking created. Creating order…');

//       const orderRes = await createOrder({
//         package_id: Number(form.package_id),
//         booking_id: booking.id,
//         promo_code: promoCode.trim() || undefined,
//       });

//       const rpOrderId = orderRes?.order?.id;
//       const payment_link = orderRes?.payment_link || null;

//       save('last_order', {
//         order: orderRes?.order,
//         order_db: orderRes?.order_db,
//         payment_link,
//         pricing_snapshot: orderRes?.pricing_snapshot,
//       });

//       if (payment_link) openPaymentLink(payment_link);

//       setResult({
//         booking,
//         orderDb: orderRes?.order_db,
//         rpOrderId,
//         payment_link,
//         pricing_snapshot: orderRes?.pricing_snapshot,
//       });
//       setStep(4);
//       setMsg('Order created. Complete payment in the opened tab.');
//     } catch (e) {
//       console.error(e);
//       const friendly = e?.data?.error || e.message || 'Something went wrong';
//       setMsg(String(friendly));
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="card p-6 md:p-8">
//       <h3 className="text-2xl font-semibold mb-4">Book Your Unforgettable Escape</h3>

//       {!token && (
//         <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl">
//           Tip: Login first for faster checkout. You can still book without logging in.
//         </p>
//       )}

//       {step <= 3 && (
//         <div className="mb-6 flex items-center gap-2 text-sm">
//           {['Event', 'Package', 'Details', 'Review'].map((s, i) => (
//             <div key={s} className="flex items-center gap-2">
//               <span className={'px-2 py-1 rounded-full ' + (i <= step ? 'bg-leaf text-white' : 'bg-slate-100')}>
//                 {i + 1}
//               </span>
//               <span className={i === step ? 'font-medium' : ''}>{s}</span>
//               {i < 3 && <span className="opacity-40">›</span>}
//             </div>
//           ))}
//         </div>
//       )}

//       {Boolean(msg) && (
//         <div className="mb-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
//           {msg}
//         </div>
//       )}

//       {/* STEP 0: Event + Primary (kept) + User preview */}
//       {step === 0 && (
//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="md:col-span-2">
//             <label className="label">Event</label>
//             <div className="input">
//               {eventInfo
//                 ? `${eventInfo.name || 'Event'} — ${eventInfo.start_date} → ${eventInfo.end_date}`
//                 : '—'}
//             </div>
//           </div>

//           <div className="md:col-span-2">
//             <label className="label">Your Details</label>
//             {form.name || form.email || form.phone ? (
//               <div className="grid md:grid-cols-3 gap-4">
//                 <div className="input">{form.name || '(No name)'}</div>
//                 <div className="input">{form.email || '(No email)'}</div>
//                 <div className="input">{form.phone || '(No phone)'}</div>
//               </div>
//             ) : (
//               <div className="text-sm text-slate-600">
//                 Sign in to auto-fill your details. We’ll collect them on the next step.
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="label">Primary Age</label>
//             <input
//               type="number"
//               min="0"
//               max="120"
//               value={form.primary_age}
//               onChange={handle('primary_age')}
//               className="input"
//               placeholder="e.g., 28"
//             />
//           </div>

//           <div>
//             <label className="label">Primary Blood Group (optional)</label>
//             <input
//               value={form.blood_group}
//               onChange={handle('blood_group')}
//               className="input"
//               placeholder="e.g., O+"
//             />
//           </div>
//         </div>
//       )}

//       {/* STEP 1: Package + Stay Type + Companions + Availability (COMPANIONS MOVED HERE) */}
//       {step === 1 && (
//         <div className="space-y-4">
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="label">Package</label>
//               <div className="input">
//                 {packageInfo ? `${packageInfo.name} — ₹${packageInfo.price_inr?.toLocaleString('en-IN')}` : form.package}
//               </div>
//             </div>

//             <div>
//               <label className="label">Stay Type</label>
//               <select
//                 className="input"
//                 value={selectedUnitTypeId ?? ''}
//                 onChange={(e) => setSelectedUnitTypeId(Number(e.target.value))}
//                 disabled={!unitTypes.length}
//               >
//                 {unitTypes.map(ut => (
//                   <option key={ut.id} value={ut.id}>{ut.name}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="md:col-span-2">
//               <label className="label">Special Notes</label>
//               <input
//                 value={form.notes}
//                 onChange={handle('notes')}
//                 placeholder="Allergies, room preference, etc."
//                 className="input"
//               />
//             </div>

//             {availability && (
//               <div className="md:col-span-2 text-sm text-emerald-700">
//                 ✓ Available units: {availability.available_units} (capacity {availability.total_capacity})
//                 {Array.isArray(availability.breakdown) && availability.breakdown.length ? (
//                   <div className="mt-2 text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
//                     <div className="font-medium">By Stay Type:</div>
//                     <ul className="list-disc pl-5">
//                       {availability.breakdown.map((b, idx) => (
//                         <li key={idx}>
//                           {b.unit_type?.name}: {b.available_units} available (cap {b.total_capacity})
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ) : null}
//               </div>
//             )}
//           </div>

//           {/* Companions editor (moved to this step) */}
//           <div>
//             <div className="flex items-center justify-between">
//               <label className="label">Companions</label>
//               <div className="flex gap-2">
//                 <button type="button" className="btn bg-slate-100" onClick={addCompanion}>+ Add</button>
//                 {form.companions.length > 0 && (
//                   <button type="button" className="btn bg-slate-100" onClick={() => setForm(f => ({ ...f, companions: [] }))}>
//                     Clear All
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-3">
//               {(form.companions || []).map((c, idx) => (
//                 <div key={idx} className="grid md:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
//                   <input
//                     className="input"
//                     placeholder="Name"
//                     value={c.name}
//                     onChange={(e) => editCompanion(idx, 'name', e.target.value)}
//                   />
//                   <input
//                     className="input"
//                     type="number"
//                     placeholder="Age"
//                     value={c.age}
//                     onChange={(e) => editCompanion(idx, 'age', e.target.value)}
//                   />
//                   <div className="flex gap-2">
//                     <input
//                       className="input flex-1"
//                       placeholder="Blood Group"
//                       value={c.blood_group}
//                       onChange={(e) => editCompanion(idx, 'blood_group', e.target.value)}
//                     />
//                     <button type="button" className="btn bg-slate-100" onClick={() => removeCompanion(idx)}>
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* STEP 2: Details + Promo + Pricing (MOVED HERE) */}
//       {step === 2 && (
//         <div className="space-y-4">
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <label className="label">Full Name</label>
//               <input value={form.name} onChange={handle('name')} className="input" />
//             </div>
//             <div>
//               <label className="label">Email</label>
//               <input type="email" value={form.email} onChange={handle('email')} className="input" />
//             </div>
//             <div>
//               <label className="label">Phone</label>
//               <input value={form.phone} onChange={handle('phone')} className="input" />
//             </div>
//           </div>

//           <div className="md:col-span-2">
//             <label className="label">Promo Code (optional)</label>
//             <div className="flex gap-2">
//               <input
//                 value={promoCode}
//                 onChange={(e) => setPromoCode(e.target.value)}
//                 placeholder='e.g., EARLY BIRD'
//                 className="input flex-1"
//               />
//               <button type="button" className="btn bg-slate-100" onClick={previewPromo}>Preview</button>
//             </div>
//           </div>

//           {pricing && (
//             <div className="md:col-span-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
//               <div className="font-medium">Estimated Price</div>
//               <div>Base: ₹{pricing.base_inr.toLocaleString('en-IN')}</div>
//               <div>
//                 Extras: ₹{pricing.extras_inr.toLocaleString('en-IN')}{' '}
//                 <span className="opacity-70">
//                   = Adults ₹{pricing.extras_adults_inr.toLocaleString('en-IN')}
//                   {' '}+ Half ₹{pricing.extras_half_inr.toLocaleString('en-IN')}
//                 </span>
//                 <span className="opacity-60">
//                   {' '} (adults {pricing.extra_adults_count}, half {pricing.extra_half_count})
//                 </span>
//               </div>
//               <div className="font-medium">Subtotal: ₹{pricing.subtotal_inr.toLocaleString('en-IN')}</div>
//               {pricing.discount_inr > 0 && (
//                 <div className="text-emerald-700">
//                   Promo discount: −₹{pricing.discount_inr.toLocaleString('en-IN')}
//                 </div>
//               )}
//               <div className="font-semibold">
//                 Total: ₹{(pricing.total_inr || pricing.subtotal_inr).toLocaleString('en-IN')}
//               </div>
//             </div>
//           )}

//         </div>
//       )}

//       {/* STEP 3: Review */}
//       {step === 3 && (
//         <div className="space-y-2 text-slate-700">
//           <div><span className="font-medium">Event:</span> {eventInfo ? `${eventInfo.start_date} → ${eventInfo.end_date}` : '—'}</div>
//           <div><span className="font-medium">Package:</span> {packageInfo?.name || form.package}</div>
//           <div><span className="font-medium">Stay Type:</span> {unitTypes.find(u => Number(u.id) === Number(selectedUnitTypeId))?.name || '—'}</div>
//           <div><span className="font-medium">Primary Age:</span> {form.primary_age || '—'}</div>
//           <div><span className="font-medium">Primary Blood Group:</span> {form.blood_group || '—'}</div>

//           {form.companions?.length ? (
//             <div className="mt-2">
//               <div className="font-medium">Companions:</div>
//               <ul className="list-disc pl-5">
//                 {form.companions.map((c, i) => (
//                   <li key={i}>{c.name || '(Unnamed)'} — {c.age || '?'} yrs {c.blood_group ? `· ${c.blood_group}` : ''}</li>
//                 ))}
//               </ul>
//             </div>
//           ) : null}

//           {pricing && (
//             <div className="mt-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
//               <div className="font-medium">Price Summary</div>
//               <div>Base: ₹{pricing.base_inr.toLocaleString('en-IN')}</div>
//               <div>
//                 Extras: ₹{pricing.extras_inr.toLocaleString('en-IN')}{' '}
//                 <span className="opacity-70">
//                   = Adults ₹{pricing.extras_adults_inr.toLocaleString('en-IN')}
//                   {' '}+ Half ₹{pricing.extras_half_inr.toLocaleString('en-IN')}
//                 </span>
//                 <span className="opacity-60">
//                   {' '} (adults {pricing.extra_adults_count}, half {pricing.extra_half_count})
//                 </span>
//               </div>
//               <div>Subtotal: ₹{pricing.subtotal_inr.toLocaleString('en-IN')}</div>
//               {pricing.discount_inr > 0 && (
//                 <div className="text-emerald-700">
//                   Promo discount: −₹{pricing.discount_inr.toLocaleString('en-IN')}
//                 </div>
//               )}
//               <div className="font-semibold">
//                 Total: ₹{(pricing.total_inr || pricing.subtotal_inr).toLocaleString('en-IN')}
//               </div>
//             </div>
//           )}


//           <div className="pt-2 text-xs text-slate-500">
//             Hidden slice: event {form.event_id} · property {form.property_id} · unit {selectedUnitTypeId} · {uc(packageInfo?.name || form.category)}
//           </div>
//         </div>
//       )}

//       {/* STEP 4: Result */}
//       {step === 4 && result && (
//         <div className="text-center">
//           <div className="text-3xl font-bold text-leaf">Booking Created</div>
//           <p className="mt-2">
//             Booking ref: <span className="font-mono">{result.booking?.id}</span>
//           </p>
//           {result.pricing_snapshot && (
//             <p className="mt-2 text-sm">
//               Total (after promo): ₹{(result.pricing_snapshot.total_inr ?? result.pricing_snapshot.promo?.final_total_inr ?? 0).toLocaleString('en-IN')}
//             </p>
//           )}
//           <div className="mt-4 flex justify-center gap-3">
//             {result.payment_link ? (
//               <a className="btn btn-primary" href={result.payment_link} target="_blank" rel="noreferrer">
//                 Open Payment Link
//               </a>
//             ) : null}
//             {result.rpOrderId ? (
//               <button className="btn bg-slate-100" onClick={() => downloadTicket(result.rpOrderId)}>
//                 Download Ticket (PDF)
//               </button>
//             ) : null}
//           </div>
//           <p className="opacity-70 mt-2 text-sm">
//             If the ticket isn’t ready yet, finish payment in the opened tab and try again.
//           </p>
//         </div>
//       )}

//       {/* Actions */}
//       <div className="mt-6 flex gap-3">
//         {step > 0 && step < 4 ? (
//           <button type="button" className="btn bg-slate-100" onClick={prev}>
//             Back
//           </button>
//         ) : null}

//         {step < 3 ? (
//           <button type="button" className="btn btn-primary" disabled={!canNext} onClick={next}>
//             Next
//           </button>
//         ) : null}

//         {step === 3 ? (
//           <button type="button" className="btn btn-primary" onClick={submit} disabled={saving}>
//             {saving ? 'Processing...' : 'Pay & Confirm'}
//           </button>
//         ) : null}
//       </div>
//     </div>
//   );
// }





//



//




// src/components/BookingForm.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  createBooking,
  createOrder,
  openPaymentLink,
  downloadTicket,
} from '../api';
import { useAuth } from '../state/AuthContext';

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api/').replace(/\/+$/, '');

// --- helpers ---
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const uc = (s) => (s || '').toUpperCase();

// keep exact code user typed (only trim ends)
async function fetchPromoPreview({ code, package_id, amount_inr }) {
  const url = new URL(`${API_BASE}/promocodes/validate`);
  url.searchParams.set('code', code.trim()); // keep inner spaces like "EARLY BIRD"
  url.searchParams.set('package_id', String(package_id));
  if (amount_inr != null) url.searchParams.set('amount_inr', String(amount_inr));
  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) throw new Error('Promo validate failed');
  return res.json();
}

// pricing with explicit adults / half breakdown
function computePricing(pkg, companions, promoPreview) {
  if (!pkg) return null;

  const baseIncludes = Number(pkg.base_includes ?? 1) || 1; // base includes the primary
  const basePrice = Number(pkg.price_inr ?? 0) || 0;
  const extraAdultPrice = Number(pkg.extra_price_adult_inr ?? 0) || 0;
  const childFreeMax = Number(pkg.child_free_max_age ?? 0);
  const childHalfMax = Number(pkg.child_half_max_age ?? 0);
  const halfMult = Number(pkg.child_half_multiplier ?? 0.5);

  const totalGuests = 1 + (companions?.length || 0);

  // companions only; primary is included in base
  let adults = 0, half = 0, free = 0;
  (companions || []).forEach(c => {
    const age = Number(c.age);
    if (!Number.isFinite(age)) { adults += 1; return; } // no age treated as adult
    if (age <= childFreeMax) free += 1;
    else if (age <= childHalfMax) half += 1;
    else adults += 1;
  });

  // beyond base?
  const extrasCount = Math.max(0, totalGuests - baseIncludes);
  const chargeableAdults = Math.min(adults, extrasCount);
  const remainAfterAdults = Math.max(0, extrasCount - chargeableAdults);
  const chargeableHalf = Math.min(half, remainAfterAdults);

  const extras_adults_inr = chargeableAdults * extraAdultPrice;
  const extras_half_inr = chargeableHalf * (extraAdultPrice * halfMult);
  const extras_inr = Math.round(extras_adults_inr + extras_half_inr);

  const subtotal = basePrice + extras_inr;

  // promo preview
  let discount = 0, total = subtotal;
  if (promoPreview?.valid) {
    if (typeof promoPreview.final_inr === 'number') {
      total = promoPreview.final_inr;
      discount = Math.max(0, subtotal - total);
    } else if (typeof promoPreview.discount_inr === 'number') {
      discount = Math.max(0, promoPreview.discount_inr);
      total = Math.max(0, subtotal - discount);
    }
  }

  return {
    base_inr: basePrice,
    extra_adults_count: chargeableAdults,
    extra_half_count: chargeableHalf,
    free_count: free,
    extras_adults_inr,
    extras_half_inr,
    extras_inr,
    subtotal_inr: subtotal,
    discount_inr: discount,
    total_inr: total,
  };
}

export default function BookingForm() {
  const { token, profile } = useAuth();
  const location = useLocation();
  const pkgIdFromNav = (location.state && location.state.package_id) || null;
  const pkgNameFromNav = (location.state && location.state.package) || '';

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [msg, setMsg] = useState('');

  const [eventInfo, setEventInfo] = useState(null);
  const [packageInfo, setPackageInfo] = useState(null);

  const [availability, setAvailability] = useState(null);
  const [unitTypes, setUnitTypes] = useState([]);
  const [selectedUnitTypeId, setSelectedUnitTypeId] = useState(null);

  const [promoCode, setPromoCode] = useState('');
  const [promoPreview, setPromoPreview] = useState(null); // used on Details step

  const [form, setForm] = useState({
    // display/context
    package_id: pkgIdFromNav,
    package: pkgNameFromNav || 'Tent',
    notes: '',

    // primary person
    name: '',
    email: '',
    phone: '',
    blood_group: '',
    primary_age: '',

    // companions (now in Package step)
    companions: [],

    // backend slice (hidden)
    event_id: Number(import.meta.env.VITE_DEFAULT_EVENT_ID || 1),
    property_id: Number(import.meta.env.VITE_DEFAULT_PROPERTY_ID || 1),
    category: (import.meta.env.VITE_DEFAULT_CATEGORY || pkgNameFromNav || 'TENT').toUpperCase(),
  });

  // ----- Prefill user details -----
  useEffect(() => {
    let info = profile;
    if (!info) {
      try { info = JSON.parse(localStorage.getItem('user_info') || 'null'); } catch {}
      if (!info) { try { info = JSON.parse(sessionStorage.getItem('user_info') || 'null'); } catch {} }
    }
    if (info) {
      const name = info.name || [info.given_name, info.family_name].filter(Boolean).join(' ') || '';
      const email = info.email || info.username || '';
      const phone = info.phone_number || info.phone || '';
      setForm(f => ({
        ...f,
        name: f.name || name,
        email: f.email || email,
        phone: f.phone || phone,
      }));
    }
  }, [profile]);

  // ----- Load event + packages -----
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/packages`, { credentials: 'include' });
        const data = await res.json();

        const eventObj = data?.event || null;
        const pkgs = data?.packages || (Array.isArray(data) ? data : []) || [];
        let pkg = null;
        if (pkgIdFromNav) pkg = pkgs.find(p => Number(p.id) === Number(pkgIdFromNav)) || null;
        if (!pkg && pkgs.length) pkg = pkgs[0];

        if (!alive) return;

        setEventInfo(eventObj);
        if (eventObj?.id) setForm((f) => ({ ...f, event_id: Number(eventObj.id) }));

        if (pkg) {
          setPackageInfo(pkg);
          setForm((f) => ({
            ...f,
            package_id: Number(pkg.id),
            package: pkg.name || f.package,
            category: uc(pkg.name || f.category), // keep category in sync with selected package
          }));
        }
      } catch (e) {
        console.error('[Booking] fetch /packages failed', e);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Auto-check availability when event/package changes -----
  useEffect(() => {
    let alive = true;
    async function run() {
      if (!form.event_id || !form.package_id) return;
      setMsg('Checking availability…');
      try {
        const u = new URL(`${API_BASE}/inventory/availability`);
        u.searchParams.set('event_id', String(form.event_id));
        u.searchParams.set('package_id', String(form.package_id));
        const res = await fetch(u.toString(), { credentials: 'include' });
        if (!res.ok) throw new Error('availability failed');
        const data = await res.json();
        if (!alive) return;

        setAvailability(data);
        save('last_availability', data);

        const allowed = data?.package?.allowed_unit_types || [];
        setUnitTypes(allowed);
        if (allowed.length) {
          setSelectedUnitTypeId(prev =>
            prev && allowed.some(x => Number(x.id) === Number(prev)) ? prev : Number(allowed[0].id)
          );
        } else {
          setSelectedUnitTypeId(null);
        }
        setMsg(`Available: ${data.available_units} (capacity ${data.total_capacity})`);
      } catch (e) {
        console.error(e);
        setAvailability(null);
        setUnitTypes([]);
        setSelectedUnitTypeId(null);
        setMsg('Availability check failed.');
      }
    }
    run();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.event_id, form.package_id]);

  // ----- Pricing (uses promoPreview only on Details step) -----
  const pricing = useMemo(() => {
    return computePricing(packageInfo, form.companions, promoPreview);
  }, [packageInfo, form.companions, promoPreview]);

  // ----- Companions edit helpers (on Package step) -----
  const addCompanion = () =>
    setForm(f => ({ ...f, companions: [...(f.companions || []), { name: '', age: '', blood_group: '' }] }));
  const removeCompanion = (idx) =>
    setForm(f => ({ ...f, companions: f.companions.filter((_, i) => i !== idx) }));
  const editCompanion = (idx, key, value) =>
    setForm(f => {
      const arr = [...(f.companions || [])];
      arr[idx] = { ...arr[idx], [key]: value };
      return { ...f, companions: arr };
    });

  // ----- Step guards -----
  const canNext = useMemo(() => {
    if (step === 0) return Boolean(eventInfo) && String(form.primary_age).trim() !== '';
    if (step === 1) return Boolean(form.package_id) && Boolean(selectedUnitTypeId);
    if (step === 2) return Boolean(form.name) && Boolean(form.email) && Boolean(form.phone);
    return true;
  }, [step, form, eventInfo, selectedUnitTypeId]);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // ----- Promo & Pricing (Details step) -----
  const previewPromo = async () => {
    if (!promoCode.trim() || !packageInfo) { setPromoPreview(null); return; }
    try {
      const approxAmount =
        computePricing(packageInfo, form.companions, null)?.subtotal_inr ??
        packageInfo.price_inr ??
        0;
      setMsg('Checking promo…');
      const data = await fetchPromoPreview({
        code: promoCode, // keep spaces
        package_id: form.package_id,
        amount_inr: approxAmount,
      });
      setPromoPreview(data);
      save('last_promo', data);
      setMsg('Promo looks good.');
    } catch (e) {
      console.error(e);
      setPromoPreview(null);
      setMsg('Promo invalid or expired.');
    }
  };

  // ----- Submit -----
  async function submit() {
    setSaving(true);
    setMsg('Creating booking…');
    try {
      const payload = {
        event_id: Number(form.event_id),
        property_id: Number(form.property_id),
        unit_type_id: Number(selectedUnitTypeId),
        category: uc(packageInfo?.name || form.category),

        package_id: Number(form.package_id),
        promo_code: promoCode.trim() || undefined,

        blood_group: uc(form.blood_group).slice(0, 5),
        emergency_contact_name: (form.name || '').trim(),
        emergency_contact_phone: (form.phone || '').trim().slice(0, 32),

        primary_age: form.primary_age === '' ? undefined : Number(form.primary_age),

        companions: (form.companions || [])
          .map(c => ({
            name: (c.name || '').trim(),
            age: c.age === '' ? undefined : Number(c.age),
            blood_group: uc(c.blood_group).slice(0, 5),
          }))
          .filter(c => c.name),
      };

      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      const booking = await createBooking(payload);
      save('last_booking', booking);
      setMsg('Booking created. Creating order…');

      const orderRes = await createOrder({
        package_id: Number(form.package_id),
        booking_id: booking.id,
        promo_code: promoCode.trim() || undefined,
      });

      const rpOrderId = orderRes?.order?.id;
      const payment_link = orderRes?.payment_link || null;

      save('last_order', {
        order: orderRes?.order,
        order_db: orderRes?.order_db,
        payment_link,
        pricing_snapshot: orderRes?.pricing_snapshot,
      });

      if (payment_link) openPaymentLink(payment_link);

      setResult({
        booking,
        orderDb: orderRes?.order_db,
        rpOrderId,
        payment_link,
        pricing_snapshot: orderRes?.pricing_snapshot,
      });
      setStep(4);
      setMsg('Order created. Complete payment in the opened tab.');
    } catch (e) {
      console.error(e);
      const friendly = e?.data?.error || e.message || 'Something went wrong';
      setMsg(String(friendly));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-2xl font-semibold mb-4">Book Your Unforgettable Escape</h3>

      {!token && (
        <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl">
          Tip: Login first for faster checkout. You can still book without logging in.
        </p>
      )}

      {step <= 3 && (
        <div className="mb-6 flex items-center gap-2 text-sm">
          {['Event', 'Package', 'Details', 'Review'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={'px-2 py-1 rounded-full ' + (i <= step ? 'bg-leaf text-white' : 'bg-slate-100')}>
                {i + 1}
              </span>
              <span className={i === step ? 'font-medium' : ''}>{s}</span>
              {i < 3 && <span className="opacity-40">›</span>}
            </div>
          ))}
        </div>
      )}

      {Boolean(msg) && (
        <div className="mb-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
          {msg}
        </div>
      )}

      {/* STEP 0: Event + Primary + User preview */}
      {step === 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Event</label>
            <div className="input">
              {eventInfo
                ? `${eventInfo.name || 'Event'} — ${eventInfo.start_date} → ${eventInfo.end_date}`
                : '—'}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="label">Your Details</label>
            {form.name || form.email || form.phone ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="input">{form.name || '(No name)'}</div>
                <div className="input">{form.email || '(No email)'}</div>
                <div className="input">{form.phone || '(No phone)'}</div>
              </div>
            ) : (
              <div className="text-sm text-slate-600">
                Sign in to auto-fill your details. We’ll collect them on the next step.
              </div>
            )}
          </div>

          <div>
            <label className="label">Primary Age</label>
            <input
              type="number"
              min="0"
              max="120"
              value={form.primary_age}
              onChange={handle('primary_age')}
              className="input"
              placeholder="e.g., 28"
            />
          </div>

          <div>
            <label className="label">Primary Blood Group (optional)</label>
            <input
              value={form.blood_group}
              onChange={handle('blood_group')}
              className="input"
              placeholder="e.g., O+"
            />
          </div>
        </div>
      )}

      {/* STEP 1: Package + Stay Type + Companions + Availability */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Package</label>
              <div className="input">
                {packageInfo ? `${packageInfo.name} — ₹${packageInfo.price_inr?.toLocaleString('en-IN')}` : form.package}
              </div>
            </div>

            <div>
              <label className="label">Stay Type</label>
              <select
                className="input"
                value={selectedUnitTypeId ?? ''}
                onChange={(e) => setSelectedUnitTypeId(Number(e.target.value))}
                disabled={!unitTypes.length}
              >
                {unitTypes.map(ut => (
                  <option key={ut.id} value={ut.id}>{ut.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">Special Notes</label>
              <input
                value={form.notes}
                onChange={handle('notes')}
                placeholder="Allergies, room preference, etc."
                className="input"
              />
            </div>

            {availability && (
              <div className="md:col-span-2 text-sm text-emerald-700">
                ✓ Available units: {availability.available_units} (capacity {availability.total_capacity})
                {Array.isArray(availability.breakdown) && availability.breakdown.length ? (
                  <div className="mt-2 text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="font-medium">By Stay Type:</div>
                    <ul className="list-disc pl-5">
                      {availability.breakdown.map((b, idx) => (
                        <li key={idx}>
                          {b.unit_type?.name}: {b.available_units} available (cap {b.total_capacity})
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Companions editor */}
          <div>
            <div className="flex items-center justify-between">
              <label className="label">Companions</label>
              <div className="flex gap-2">
                <button type="button" className="btn bg-slate-100" onClick={addCompanion}>+ Add</button>
                {form.companions.length > 0 && (
                  <button type="button" className="btn bg-slate-100" onClick={() => setForm(f => ({ ...f, companions: [] }))}>
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {(form.companions || []).map((c, idx) => (
                <div key={idx} className="grid md:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <input
                    className="input"
                    placeholder="Name"
                    value={c.name}
                    onChange={(e) => editCompanion(idx, 'name', e.target.value)}
                  />
                  <input
                    className="input"
                    type="number"
                    placeholder="Age"
                    value={c.age}
                    onChange={(e) => editCompanion(idx, 'age', e.target.value)}
                  />
                  <div className="flex gap-2">
                    <input
                      className="input flex-1"
                      placeholder="Blood Group"
                      value={c.blood_group}
                      onChange={(e) => editCompanion(idx, 'blood_group', e.target.value)}
                    />
                    <button type="button" className="btn bg-slate-100" onClick={() => removeCompanion(idx)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Details + Promo + Pricing */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input value={form.name} onChange={handle('name')} className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={handle('email')} className="input" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input value={form.phone} onChange={handle('phone')} className="input" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="label">Promo Code (optional)</label>
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder='e.g., EARLY BIRD'
                className="input flex-1"
              />
              <button type="button" className="btn bg-slate-100" onClick={previewPromo}>Preview</button>
            </div>
          </div>

          {pricing && (
            <div className="md:col-span-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <div className="font-medium">Estimated Price</div>
              <div>Base: ₹{pricing.base_inr.toLocaleString('en-IN')}</div>
              <div>
                Extras: ₹{pricing.extras_inr.toLocaleString('en-IN')}{' '}
                <span className="opacity-70">
                  = Adults ₹{pricing.extras_adults_inr.toLocaleString('en-IN')}
                  {' '}+ Half ₹{pricing.extras_half_inr.toLocaleString('en-IN')}
                </span>
                <span className="opacity-60">
                  {' '} (adults {pricing.extra_adults_count}, half {pricing.extra_half_count})
                </span>
              </div>
              <div className="font-medium">Subtotal: ₹{pricing.subtotal_inr.toLocaleString('en-IN')}</div>
              {pricing.discount_inr > 0 && (
                <div className="text-emerald-700">
                  Promo discount: −₹{pricing.discount_inr.toLocaleString('en-IN')}
                </div>
              )}
              <div className="font-semibold">
                Total: ₹{(pricing.total_inr || pricing.subtotal_inr).toLocaleString('en-IN')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Review */}
      {step === 3 && (
        <div className="space-y-2 text-slate-700">
          <div><span className="font-medium">Event:</span> {eventInfo ? `${eventInfo.start_date} → ${eventInfo.end_date}` : '—'}</div>
          <div><span className="font-medium">Package:</span> {packageInfo?.name || form.package}</div>
          <div><span className="font-medium">Stay Type:</span> {unitTypes.find(u => Number(u.id) === Number(selectedUnitTypeId))?.name || '—'}</div>
          <div><span className="font-medium">Primary Age:</span> {form.primary_age || '—'}</div>
          <div><span className="font-medium">Primary Blood Group:</span> {form.blood_group || '—'}</div>

          {form.companions?.length ? (
            <div className="mt-2">
              <div className="font-medium">Companions:</div>
              <ul className="list-disc pl-5">
                {form.companions.map((c, i) => (
                  <li key={i}>{c.name || '(Unnamed)'} — {c.age || '?'} yrs {c.blood_group ? `· ${c.blood_group}` : ''}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {pricing && (
            <div className="mt-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <div className="font-medium">Price Summary</div>
              <div>Base: ₹{pricing.base_inr.toLocaleString('en-IN')}</div>
              <div>
                Extras: ₹{pricing.extras_inr.toLocaleString('en-IN')}{' '}
                <span className="opacity-70">
                  = Adults ₹{pricing.extras_adults_inr.toLocaleString('en-IN')}
                  {' '}+ Half ₹{pricing.extras_half_inr.toLocaleString('en-IN')}
                </span>
                <span className="opacity-60">
                  {' '} (adults {pricing.extra_adults_count}, half {pricing.extra_half_count})
                </span>
              </div>
              <div>Subtotal: ₹{pricing.subtotal_inr.toLocaleString('en-IN')}</div>
              {pricing.discount_inr > 0 && (
                <div className="text-emerald-700">
                  Promo discount: −₹{pricing.discount_inr.toLocaleString('en-IN')}
                </div>
              )}
              <div className="font-semibold">
                Total: ₹{(pricing.total_inr || pricing.subtotal_inr).toLocaleString('en-IN')}
              </div>
            </div>
          )}

          <div className="pt-2 text-xs text-slate-500">
            Hidden slice: event {form.event_id} · property {form.property_id} · unit {selectedUnitTypeId} · {uc(packageInfo?.name || form.category)}
          </div>
        </div>
      )}

      {/* STEP 4: Result */}
      {step === 4 && result && (
        <div className="text-center">
          <div className="text-3xl font-bold text-leaf">Booking Created</div>
          <p className="mt-2">
            Booking ref: <span className="font-mono">{result.booking?.id}</span>
          </p>
          {result.pricing_snapshot && (
            <p className="mt-2 text-sm">
              Total (after promo): ₹{(result.pricing_snapshot.total_inr ?? result.pricing_snapshot.promo?.final_total_inr ?? 0).toLocaleString('en-IN')}
            </p>
          )}
          <div className="mt-4 flex justify-center gap-3">
            {result.payment_link ? (
              <a className="btn btn-primary" href={result.payment_link} target="_blank" rel="noreferrer">
                Open Payment Link
              </a>
            ) : null}
            {result.rpOrderId ? (
              <button className="btn bg-slate-100" onClick={() => downloadTicket(result.rpOrderId)}>
                Download Ticket (PDF)
              </button>
            ) : null}
          </div>
          <p className="opacity-70 mt-2 text-sm">
            If the ticket isn’t ready yet, finish payment in the opened tab and try again.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        {step > 0 && step < 4 ? (
          <button type="button" className="btn bg-slate-100" onClick={prev}>
            Back
          </button>
        ) : null}

        {step < 3 ? (
          <button type="button" className="btn btn-primary" disabled={!canNext} onClick={next}>
            Next
          </button>
        ) : null}

        {step === 3 ? (
          <button type="button" className="btn btn-primary" onClick={submit} disabled={saving}>
            {saving ? 'Processing...' : 'Pay & Confirm'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
