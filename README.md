# My-profile
<div class="island" id="top">
  <header class="topbar">
    <a class="brand" href="#top"><span class="brand-mark">MZ</span><span>MY LITTLE WORLD</span></a>
    <button class="edit-btn" id="openSettings">✳ تخصيص موقعي</button>
  </header>

  <main>
    <section class="hero">
      <div class="sun"></div>
      <div class="hat" aria-label="قبعة قشية"><div class="hat-top"></div><div class="hat-band"></div><div class="hat-brim"></div></div>
      <div class="hero-copy">
        <p class="eyebrow">A LITTLE SPACE ON THE INTERNET</p>
        <h1>أهلًا، أني<br><span id="displayName">مصطفى علي</span><span class="dot">.</span></h1>
        <p class="bio" id="displayBio">هنا عالمي الصغير، حساباتي، اهتماماتي وكل شيء أحب أشاركه وياكم.</p>
        <a class="discover" href="#links">اكتشف عالمي <span>↘</span></a>
      </div>
      <div class="portrait-wrap">
        <div class="portrait-frame">
          <img id="profilePhoto" alt="صورتي الشخصية" hidden>
          <div id="photoPlaceholder" class="photo-placeholder"><span>صورتك<br>هنا</span><small>YOUR PHOTO</small></div>
        </div>
        <span class="photo-note">THIS IS ME ↗</span>
        <label class="photo-upload" for="photoInput">＋ أضف صورتك</label>
        <input id="photoInput" type="file" accept="image/*" hidden>
      </div>
      <div class="side-note">MADE OF DREAMS & LITTLE THINGS</div>
      <div class="hero-number">001 <span>— PERSONAL SPACE</span></div>
    </section>

    <section class="links-section" id="links">
      <div class="section-head"><div><p class="eyebrow">FIND ME ELSEWHERE</p><h2>نلتقي <span>هنا.</span></h2></div><span class="tiny-star">✳</span></div>
      <p class="section-desc">اختار المنصة اللي تحب تتابعني عليها.</p>
      <div class="social-list" id="socialList"></div>
      <button class="add-link" id="addLinkButton">＋ أضف رابط جديد</button>
    </section>

    <section class="about-section">
      <span class="about-stamp">M<br>Z</span>
      <div><p class="eyebrow">A WORK IN PROGRESS</p><h2>كل فكرة إلها<br>بداية صغيرة.</h2><p>هذا مو مجرد موقع روابط؛ هذا مكان يجمع هويتي الرقمية، ويتطور وياي خطوة بخطوة.</p></div>
    </section>

    <footer><a href="#top" class="footer-brand">MZ<span>✳</span></a><p>جميع الحقوق محفوظة لدى Z 2008</p><a href="#top">للأعلى ↑</a></footer>
  </main>
</div>

<div class="modal-backdrop" id="settingsModal" hidden>
  <section class="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
    <div class="settings-head"><div><p class="eyebrow">YOUR SPACE, YOUR RULES</p><h2 id="settingsTitle">خصص موقعك</h2></div><button id="closeSettings" class="close-btn" aria-label="إغلاق">✕</button></div>
    <label>الاسم المعروض<input id="nameInput" maxlength="45" value="مصطفى علي"></label>
    <label>وصف قصير<textarea id="bioInput" maxlength="180" rows="3">هنا عالمي الصغير، حساباتي، اهتماماتي وكل شيء أحب أشاركه وياكم.</textarea></label>
    <div class="settings-note">لتغيير رابط موجود، اضغط عليه في القائمة الرئيسية. تگدر أيضاً تضيف رابط جديد.</div>
    <button id="saveSettings" class="save-btn">حفظ التغييرات على هذا الجهاز</button>
    <button id="resetSettings" class="reset-btn">إعادة النموذج الأصلي</button>
  </section>
</div>

<div class="toast" id="toast" role="status"></div>
