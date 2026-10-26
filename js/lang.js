/* =============================================================
   lang.js — trilingual string maps (English / Hindi / Marathi)
   Pure data + the rsvpT() lookup helper. No DOM, no side effects.
   Loaded before app.js. All identifiers are globals (no build step).
   ============================================================= */

const T={
 en:{kicker:"A MEETING OF TWO HOMES",sub:"Nashik · Bharatpur · December 2026",iam:"I am …",
  t_story:"Story",t_planner:"Planner",t_decisions:"Decisions",t_vendors:"Vendors",t_tracker:"Tracker",t_budget:"Budget",t_soul:"Soul",t_wishes:"Wishes",addWish:"Add a blessing or wish…",wishEmpty:"No wishes yet. Add the first blessing.",splitTitle:"Who leads what",sharedTitle:"Together",
  totalPlanned:"Total planned",whoTitle:"Who's planning?",whoSub:"Pick your name so your votes and ticks show for everyone. No sign-up.",
  addTodo:"Add a to-do…",bCat:"Category",bAmt:"₹ planned",voteBtn:"vote",voted:"✓ voted",votes:"votes",vote1:"vote",
  vWait:"waiting",vReplied:"replied",vBooked:"booked",
  decBanner:"Tap your choice to vote. Everyone sees the tally live. Change your mind anytime.",
  venBanner:"Tap a status to cycle: waiting → replied → booked.",
  shareTitle:"Share with family",shareSub:"Scan the code or tap a button to open this on any phone.",shareWa:"Share on WhatsApp",shareCopy:"Copy link",shareCopied:"Link copied ✓",shareScan:"Point your camera here",shareMsg:"You're invited to follow Roma & Prashant's wedding journey 💛 Tap to open:",
  todoEmpty:"No to-dos yet. Add the first one above.",budgetEmpty:"No budget lines yet.",
  people:{RomaFam:"Roma Family",PrashantFam:"Prashant Family"}},
 hi:{kicker:"दो घरों का मिलन",sub:"नासिक · भरतपुर · नवंबर",iam:"मैं हूँ …",
  t_story:"कहानी",t_planner:"योजना",t_decisions:"फ़ैसले",t_vendors:"वेंडर",t_tracker:"ट्रैकर",t_budget:"बजट",t_soul:"आत्मा",t_wishes:"शुभकामनाएँ",addWish:"एक आशीर्वाद या शुभकामना जोड़ें…",wishEmpty:"अभी कोई शुभकामना नहीं. पहला आशीर्वाद जोड़ें.",splitTitle:"कौन क्या संभालता है",sharedTitle:"साथ में",
  totalPlanned:"कुल नियोजित",whoTitle:"कौन योजना बना रहा है?",whoSub:"अपना नाम चुनें ताकि आपके वोट और टिक सबको दिखें. कोई साइन-अप नहीं.",
  addTodo:"एक काम जोड़ें…",bCat:"श्रेणी",bAmt:"₹ नियोजित",voteBtn:"वोट",voted:"✓ वोट दिया",votes:"वोट",vote1:"वोट",
  vWait:"प्रतीक्षा",vReplied:"जवाब आया",vBooked:"बुक हुआ",
  decBanner:"वोट देने के लिए अपना विकल्प चुनें. सबको गिनती लाइव दिखती है. कभी भी बदल सकते हैं.",
  venBanner:"स्थिति बदलने के लिए टैप करें: प्रतीक्षा → जवाब आया → बुक हुआ.",
  shareTitle:"परिवार के साथ साझा करें",shareSub:"कोड स्कैन करें या बटन दबाकर इसे किसी भी फ़ोन पर खोलें.",shareWa:"व्हाट्सएप पर साझा करें",shareCopy:"लिंक कॉपी करें",shareCopied:"लिंक कॉपी हुआ ✓",shareScan:"अपना कैमरा यहाँ रखें",shareMsg:"रोमा और प्रशांत की शादी की यात्रा देखने के लिए आप आमंत्रित हैं 💛 खोलने के लिए टैप करें:",
  todoEmpty:"अभी कोई काम नहीं. ऊपर पहला जोड़ें.",budgetEmpty:"अभी कोई बजट लाइन नहीं.",
  people:{RomaFam:"रोमा परिवार",PrashantFam:"प्रशांत परिवार"}},
 mr:{kicker:"दोन घरांचं मिलन",sub:"नाशिक · भरतपूर · नोव्हेंबर",iam:"मी आहे …",
  t_story:"कथा",t_planner:"नियोजन",t_decisions:"निर्णय",t_vendors:"वेंडर",t_tracker:"ट्रॅकर",t_budget:"बजेट",t_soul:"आत्मा",t_wishes:"शुभेच्छा",addWish:"एक आशीर्वाद किंवा शुभेच्छा जोडा…",wishEmpty:"अजून शुभेच्छा नाहीत. पहिला आशीर्वाद जोडा.",splitTitle:"कोण काय सांभाळतं",sharedTitle:"एकत्र",
  totalPlanned:"एकूण नियोजित",whoTitle:"कोण नियोजन करतंय?",whoSub:"तुमचं नाव निवडा म्हणजे तुमचे मतं व टिक सर्वांना दिसतील. साइन-अप नाही.",
  addTodo:"एक काम जोडा…",bCat:"प्रकार",bAmt:"₹ नियोजित",voteBtn:"मत द्या",voted:"✓ मत दिलं",votes:"मतं",vote1:"मत",
  vWait:"प्रतीक्षा",vReplied:"उत्तर आलं",vBooked:"बुक झालं",
  decBanner:"मत देण्यासाठी तुमचा पर्याय निवडा. सर्वांना मोजणी लाइव्ह दिसते. कधीही बदला.",
  venBanner:"स्थिती बदलण्यासाठी टॅप करा: प्रतीक्षा → उत्तर आलं → बुक झालं.",
  shareTitle:"कुटुंबासोबत शेअर करा",shareSub:"कोड स्कॅन करा किंवा बटण दाबून कोणत्याही फोनवर उघडा.",shareWa:"व्हॉट्सअ‍ॅपवर शेअर करा",shareCopy:"लिंक कॉपी करा",shareCopied:"लिंक कॉपी झाली ✓",shareScan:"तुमचा कॅमेरा इथे धरा",shareMsg:"रोमा आणि प्रशांत यांच्या लग्नाचा प्रवास पाहण्यासाठी तुम्हाला आमंत्रण 💛 उघडण्यासाठी टॅप करा:",
  todoEmpty:"अजून काही काम नाही. वर पहिलं जोडा.",budgetEmpty:"अजून बजेट ओळी नाहीत.",
  people:{RomaFam:"रोमा कुटुंब",PrashantFam:"प्रशांत कुटुंब"}},
};

const MONTHS={
 en:[{m:"Now · October–November",tag:"FINAL MILE · YOU ARE HERE",items:[["Send WhatsApp invites — final wave","ROMAFAM"],["Final headcount to Racca's — Nashik","ROMAFAM"],["Final headcount — Bharatpur","PRASHANTFAM"],["Hotel room block — Nashik outstation guests (approx 40, from 24 Dec)","ROMAFAM"],["Condo at Grape County for the US friends (around 24 Dec)","ROMAFAM"],["Confirm Bharatpur date on tickets (12 or 13 Dec)","ALL"],["Pack bridal day-of kit","ROMAFAM"],["Breathe. Enjoy it.","ALL"]]},
  {m:"December · Pune",tag:"MEHENDI + HOME POOJAS 🌿",items:[["Mehendi — Pune artist booked","ROMAFAM"],["Home poojas — Pune vendors confirmed","ROMAFAM"]]},
  {m:"12–13 December · Bharatpur",tag:"RECEPTION 🌸",items:[["Travel to Bharatpur — Rajdhani Express 🚆","ALL"],["Bharatpur reception — run of show shared 📋","PRASHANTFAM"],["Emergency contact list — Bharatpur side 📞","PRASHANTFAM"]]},
  {m:"24 December · Nashik",tag:"THE BIG RECEPTION 🎉",items:[["Travel to Nashik — 20 Dec ✈️","ALL"],["Final venue walkthrough — Racca's Green Square 🏛️","ROMAFAM"],["Roma — outfit ready + pressed 👗","ROMAFAM"],["Makeup — Do Re Do salon confirmed 💄","ROMAFAM"],["Catering final confirm 🍽️","ROMAFAM"],["Run-of-show shared with family 📋","ALL"],["Emergency contact list printed 📞","ALL"],["Enjoy every minute. You did it. 🌺","ALL"]]}],
 hi:[{m:"अभी · अक्टूबर–नवंबर",tag:"आख़िरी तैयारी",items:[["व्हाट्सऐप निमंत्रण — आख़िरी दौर","ROMAFAM"],["नासिक — कैटरर को अंतिम संख्या","ROMAFAM"],["भरतपुर — अंतिम संख्या","PRASHANTFAM"],["नासिक — बाहर से आने वालों के लिए होटल रूम","ROMAFAM"],["भरतपुर की तारीख़ टिकट से पक्की करें (12 या 13 दिस)","ALL"]]},
  {m:"दिसंबर · पुणे",tag:"मेहंदी + घर की पूजा 🌿",items:[["मेहंदी — पुणे की कलाकार","ROMAFAM"],["घर की पूजाएँ — पुणे","ROMAFAM"]]},
  {m:"12–13 दिसंबर · भरतपुर",tag:"रिसेप्शन 🌸",items:[["भरतपुर यात्रा — राजधानी एक्सप्रेस 🚆","ALL"],["रिसेप्शन का कार्यक्रम साझा 📋","PRASHANTFAM"]]},
  {m:"24 दिसंबर · नासिक",tag:"बड़ा रिसेप्शन 🎉",items:[["नासिक यात्रा — 20 दिस ✈️","ALL"],["रक्का'ज़ ग्रीन स्क्वेयर — अंतिम जाँच 🏛️","ROMAFAM"],["रोमा — पोशाक तैयार 👗","ROMAFAM"],["कार्यक्रम परिवार से साझा 📋","ALL"],["हर पल का आनंद लें 🌺","ALL"]]}],
 mr:[{m:"आता · ऑक्टोबर–नोव्हेंबर",tag:"शेवटची तयारी",items:[["व्हॉट्सॲप निमंत्रणे — शेवटची फेरी","ROMAFAM"],["नाशिक — केटररला अंतिम संख्या","ROMAFAM"],["भरतपूर — अंतिम संख्या","PRASHANTFAM"],["नाशिक — बाहेरच्या पाहुण्यांसाठी हॉटेल रूम","ROMAFAM"],["भरतपूरची तारीख तिकिटावरून पक्की करा (12 किंवा 13 डिस)","ALL"]]},
  {m:"डिसेंबर · पुणे",tag:"मेहंदी + घरच्या पूजा 🌿",items:[["मेहंदी — पुण्याची कलाकार","ROMAFAM"],["घरच्या पूजा — पुणे","ROMAFAM"]]},
  {m:"12–13 डिसेंबर · भरतपूर",tag:"स्वागत समारंभ 🌸",items:[["भरतपूर प्रवास — राजधानी एक्स्प्रेस 🚆","ALL"],["कार्यक्रमाची रूपरेषा शेअर 📋","PRASHANTFAM"]]},
  {m:"24 डिसेंबर · नाशिक",tag:"मोठा स्वागत समारंभ 🎉",items:[["नाशिक प्रवास — 20 डिस ✈️","ALL"],["रक्का'ज ग्रीन स्क्वेअर — अंतिम पाहणी 🏛️","ROMAFAM"],["रोमा — पोशाख तयार 👗","ROMAFAM"],["कार्यक्रम कुटुंबासोबत शेअर 📋","ALL"],["प्रत्येक क्षणाचा आनंद घ्या 🌺","ALL"]]}]
};
const DECISIONS={
 en:[{id:"date",q:"Nashik reception 24 Dec at Racca's Green Square. Bharatpur reception 12 or 13 Dec. All good?",opts:["Yes — locked ✅","Need to adjust one date","Still discussing"]},{id:"format",q:"Nashik event format?",opts:["Mehendi + Reception (2 days)","Full 3-day celebration","Keep it one evening"]},{id:"pune",q:"Leading Nashik venue type?",opts:["Lawns / open-air","Banquet hall","Still deciding"]},{id:"venue",q:"Guest travel — outstation accommodation?",opts:["Block hotel rooms for guests","Guests arrange themselves","Mix of both"]}],
 hi:[{id:"date",q:"नासिक: 24 दिसंबर, रक्का'ज़ ग्रीन स्क्वेयर। भरतपुर: 12 या 13 दिसंबर — सब ठीक?",opts:["हाँ — तय है ✅","एक तारीख़ बदलनी है","अभी बात हो रही है"]},{id:"format",q:"नासिक का कार्यक्रम?",opts:["मेहंदी + रिसेप्शन (2 दिन)","पूरा 3-दिन का उत्सव","एक शाम का कार्यक्रम"]},{id:"pune",q:"नासिक में वेन्यू का प्रकार?",opts:["लॉन्स / खुला वेन्यू","बैंक्वेट हॉल","अभी तय करना है"]},{id:"venue",q:"बाहर से आने वाले मेहमानों का ठहराव?",opts:["होटल रूम बुक करें","मेहमान खुद करेंगे","दोनों का मिश्रण"]}],
 mr:[{id:"date",q:"नाशिक: 24 डिसेंबर, रक्का'ज ग्रीन स्क्वेअर. भरतपूर: 12 किंवा 13 डिसेंबर — सगळं ठीक?",opts:["हो — पक्कं ✅","एक तारीख बदलायची आहे","अजून बोलणं चालू आहे"]},{id:"format",q:"नाशिकचा कार्यक्रम?",opts:["मेहंदी + रिसेप्शन (2 दिवस)","पूर्ण 3-दिवसाचा उत्सव","एक संध्याकाळचा कार्यक्रम"]},{id:"pune",q:"नाशिकमध्ये वेन्यूचा प्रकार?",opts:["लॉन्स / मोकळा वेन्यू","बँक्वेट हॉल","अजून ठरवायचंय"]},{id:"venue",q:"बाहेरून येणाऱ्या पाहुण्यांची राहण्याची व्यवस्था?",opts:["हॉटेल रूम बुक करा","पाहुणे स्वतः करतील","दोन्हीचं मिश्रण"]}],
};
const VENDORS={
 en:[["🏛️","Venue","Wedding lawn / banquet hall"],["🍽️","Catering","Menu, tasting & service"],["🌸","Decor","Stage, flowers & lighting"],["📸","Photography","Photos & video"]],
 hi:[["🏛️","वेन्यू","शादी का लॉन / बैंक्वेट हॉल"],["🍽️","कैटरिंग","मेनू, चखना और सेवा"],["🌸","सजावट","स्टेज, फूल और लाइटिंग"],["📸","फोटोग्राफी","फोटो और वीडियो"]],
 mr:[["🏛️","वेन्यू","लग्नाचे लॉन / बँक्वेट हॉल"],["🍽️","केटरिंग","मेनू, चव आणि सेवा"],["🌸","सजावट","स्टेज, फुले आणि लाइटिंग"],["📸","फोटोग्राफी","फोटो आणि व्हिडिओ"]],
};

const REACTIONS=['🌸','🙏','❤️'];

const RSVP_T={
  en:{pending:'Pending',confirmed:'Confirmed',declined:'Declined',nashik:'\u{1F33F} Nashik Events',bharatpur:'\u{1F338} Bharatpur Events',both:'\u{1F389} Both',veg:'\u{1F957} Vegetarian',roma:'Roma Family',prashant:'Prashant Family',total:'Total Guests'},
  hi:{pending:'\u092a\u094d\u0930\u0924\u0940\u0915\u094d\u0937\u093f\u0924',confirmed:'\u092a\u0941\u0937\u094d\u091f\u093f',declined:'\u0905\u0938\u094d\u0935\u0940\u0915\u093e\u0930',nashik:'\u{1F33F} \u0928\u093e\u0936\u093f\u0915 \u0915\u093e\u0930\u094d\u092f\u0915\u094d\u0930\u092e',bharatpur:'\u{1F338} \u092d\u0930\u0924\u092a\u0941\u0930 \u0915\u093e\u0930\u094d\u092f\u0915\u094d\u0930\u092e',both:'\u{1F389} \u0926\u094b\u0928\u094b\u0902',veg:'\u{1F957} \u0936\u093e\u0915\u093e\u0939\u093e\u0930\u0940',roma:'\u0930\u094b\u092e\u093e \u092a\u0930\u093f\u0935\u093e\u0930',prashant:'\u092a\u094d\u0930\u0936\u093e\u0902\u0924 \u092a\u0930\u093f\u0935\u093e\u0930',total:'\u0915\u0941\u0932 \u0905\u0924\u093f\u0925\u093f'},
  mr:{pending:'\u092a\u094d\u0930\u0924\u0940\u0915\u094d\u0937\u093f\u0924',confirmed:'\u092a\u0941\u0937\u094d\u091f\u093f',declined:'\u0928\u0915\u093e\u0930',nashik:'\u{1F33F} \u0928\u093e\u0936\u093f\u0915 \u0915\u093e\u0930\u094d\u092f\u0915\u094d\u0930\u092e',bharatpur:'\u{1F338} \u092d\u0930\u0924\u092a\u0942\u0930 \u0915\u093e\u0930\u094d\u092f\u0915\u094d\u0930\u092e',both:'\u{1F389} \u0926\u094b\u0928\u094d\u0939\u0940',veg:'\u{1F957} \u0936\u093e\u0915\u093e\u0939\u093e\u0930\u0940',roma:'\u0930\u094b\u092e\u093e \u0915\u0941\u091f\u0941\u0902\u092c',prashant:'\u092a\u094d\u0930\u0936\u093e\u0902\u0924 \u0915\u0941\u091f\u0941\u0902\u092c',total:'\u090f\u0915\u0942\u0923 \u092a\u093e\u0939\u0941\u0923\u0947'},
};
function rsvpT(k){return(RSVP_T[lang]||RSVP_T.en)[k]||k;}

/* Sync-status pill copy (used by supabase.js). */
const SYNC_TXT={
  en:{connecting:'connecting…',live:'live · synced',offline:'offline · saved on phone'},
  hi:{connecting:'\u091c\u0941\u0921\u093c \u0930\u0939\u093e\u0939\u0948…',live:'\u0932\u093e\u0907\u0935 · \u0938\u093f\u0902\u0915',offline:'\u0911\u092b\u093c\u0932\u093e\u0907\u0928 · \u092b\u093c\u094b\u0928 \u092a\u0930 \u0938\u0939\u0947\u091c\u093e'},
  mr:{connecting:'\u091c\u094b\u0921\u0924 \u0906\u0939\u0947…',live:'\u0932\u093e\u0907\u0935\u094d\u0939 · \u0938\u093f\u0902\u0915',offline:'\u0911\u092b\u0932\u093e\u0907\u0928 · \u092b\u094b\u0928\u0935\u0930 \u0938\u0947\u0935\u094d\u0939'},
};
