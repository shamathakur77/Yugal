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
 en:[{m:"Now in India (June–July)",tag:"LOCK THE BIG DECISIONS · YOU ARE HERE",items:[["Confirm all three event dates (Nashik Dec 25–27, Bharatpur Dec 10–14)","ALL"],["Agree rough guest count — use Jyostna maushi's list as base","ALL"],["Set total budget + split by event + family side","ALL"],["Visit Nashik venues in person — mid July trip","ROMAFAM"],["Book Nashik wedding venue + pay deposit","ALL"],["Shortlist caterer — Nashik","ROMAFAM"],["Confirm Bharatpur reception details with Prashant's family","PRASHANTFAM"],["Start shared guest list (Nashik side)","ROMAFAM"],["Sign Sweden house contract remotely 🇸🇪","ALL"],["Transfer funds: Nordnet + Avanza → SBAB 🏦","ALL"],["Roma — shortlist Nashik outfits + Bharatpur outfits separately","ROMAFAM"],["Book overseas family flights (Shama + Aniket side)","ROMAFAM"]]},
  {m:"August",tag:"CONFIRM · CATERING · INVITES",items:[["Book caterer — Nashik (deposit paid)","ROMAFAM"],["Confirm Bharatpur venue + catering with Prashant's family","PRASHANTFAM"],["Book photographer — must cover both cities","ALL"],["Design + order printed invites","ROMAFAM"],["Make WhatsApp digital invite","ROMAFAM"],["Book decorator + agree palette — Nashik","ROMAFAM"],["Book hotels / guest accommodation — Nashik block","ROMAFAM"],["Confirm hotel block — Bharatpur side","PRASHANTFAM"]]},
  {m:"September",tag:"SHOPPING · PREP · OUTFITS",items:[["Roma — buy Nashik reception outfit + alteration","ROMAFAM"],["Roma — buy Bharatpur court + reception outfit","ROMAFAM"],["Buy jewellery + accessories","ROMAFAM"],["Shama — finalise outfit(s) for Nashik","ROMAFAM"],["Buy return gifts","ROMAFAM"],["Book makeup artist — trial session","ROMAFAM"],["Start monthly facials — Roma","ROMAFAM"]]},
  {m:"October",tag:"BRIDE PREP · LOCK VENDORS",items:[["Re-confirm every vendor — Nashik","ROMAFAM"],["Re-confirm every vendor — Bharatpur","PRASHANTFAM"],["Book mehndi artist — Nashik","ROMAFAM"],["Confirm photographer schedule across both cities","ALL"],["Send WhatsApp invites — first wave","ROMAFAM"],["Collect altered outfits — Roma","ROMAFAM"]]},
  {m:"November",tag:"FINAL MILE · SEND · REST",items:[["Send WhatsApp invites — final wave","ROMAFAM"],["Give final headcount to caterer — Nashik","ROMAFAM"],["Give final headcount — Bharatpur","PRASHANTFAM"],["Pack bridal day-of kit","ROMAFAM"],["Assign calm day-of point person — Nashik","ALL"],["Assign calm day-of point person — Bharatpur","PRASHANTFAM"],["Breathe. Enjoy it.","ALL"]]},
  {m:"December 10–14 · Bharatpur",tag:"COURT MARRIAGE + RECEPTION 🌸",items:[["Travel to Bharatpur — all confirmed 🚆","ALL"],["Court marriage done ✅","ALL"],["Bharatpur reception — run of show shared 📋","ALL"],["Emergency contact list — Bharatpur side 📞","PRASHANTFAM"],["Groom sherwani ready 🧥","PRASHANTFAM"],["Catering confirmed + headcount final 🍽️","PRASHANTFAM"],["Mehndi + hair done 🌿","ROMAFAM"]]},
  {m:"December 25–27 · Nashik",tag:"THE BIG RECEPTION 🎉",items:[["Travel Bharatpur → Nashik ✈️","ALL"],["Final venue walkthrough — Nashik 🏛️","ROMAFAM"],["Guest headcount final — Nashik 🧮","ROMAFAM"],["Roma — Nashik outfit ready + pressed 👗","ROMAFAM"],["Mehendi + hair confirmed — Nashik 🌿","ROMAFAM"],["Band / DJ final briefing 🥁","ROMAFAM"],["Catering tasting + final confirm 🍽️","ROMAFAM"],["Hotel blocks — outstation guests 🏨","ROMAFAM"],["Run-of-show shared with family 📋","ALL"],["Emergency contact list printed 📞","ALL"],["Enjoy every minute. You did it. 🌺","ALL"]]}],
 hi:[{m:"जून – जुलाई",tag:"बड़े फ़ैसले पक्के करें",items:[["शादी + रिसेप्शन की तारीख़ें तय करें","ALL"],["मेहमानों की मोटी संख्या तय करें","ALL"],["कुल बजट तय करें + बाँटें","ALL"],["विदेश से आने वालों की फ़्लाइट बुक करें","ROMAFAM"],["साझा मेहमान सूची शुरू करें","ROMAFAM"]]},
  {m:"अगस्त",tag:"वेन्यू · कैटरिंग · प्लानर",items:[["नासिक में 3 वेन्यू छाँटें","ROMAFAM"],["लिखित कोटेशन लें","ROMAFAM"],["शादी का वेन्यू बुक करें + अग्रिम","ALL"],["कैटरर छाँटें + बुक करें","ROMAFAM"],["भरतपुर रिसेप्शन दूल्हे पक्ष से तय करें","PRASHANTFAM"]]},
  {m:"सितंबर",tag:"सजावट · निमंत्रण · ख़रीदारी",items:[["डेकोरेटर + रंग बुक करें","ALL"],["निमंत्रण डिज़ाइन + ऑर्डर करें","ROMAFAM"],["व्हाट्सएप डिजिटल निमंत्रण बनाएँ","ROMAFAM"],["दुल्हन का मुख्य पोशाक + अल्टरेशन","ROMAFAM"],["गहने + एक्सेसरीज़ ख़रीदें","ROMAFAM"],["रिटर्न गिफ़्ट (तुलशीबाग)","ROMAFAM"]]},
  {m:"अक्टूबर",tag:"दुल्हन की तैयारी · सब पक्का करें",items:[["मेकअप आर्टिस्ट बुक + ट्रायल","ROMAFAM"],["मासिक फ़ेशियल शुरू करें","ROMAFAM"],["मेहंदी + हेयर बुक करें","ROMAFAM"],["हर वेंडर दोबारा पक्का करें","ROMAFAM"],["फ़ोटोग्राफ़र पक्का करें","ALL"]]},
  {m:"नवंबर",tag:"भेजें · अंतिम · आनंद लें",items:[["व्हाट्सएप निमंत्रण भेजें","ROMAFAM"],["अंतिम संख्या दें","ROMAFAM"],["अल्टर किए कपड़े लें","ROMAFAM"],["दुल्हन की दिन-भर किट पैक करें","ROMAFAM"],["शांत दिन-प्रभारी नियुक्त करें","ALL"],["साँस लें. आनंद लें.","ALL"]]},
  {m:"दिसंबर",tag:"हो रहा है · आख़िरी कदम",items:[["अंतिम वेन्यू वॉकथ्रू — नासिक + भरतपुर 🏛️","ALL"],["अतिथि संख्या की पुष्टि — दोनों परिवार 🧮","ALL"],["दुल्हन का अंतिम फिटिंग 👗","ALL"],["दूल्हे की शेरवानी तैयार 🧥","ALL"],["मेहंदी कलाकार की पुष्टि + समय 🌿","ALL"],["बैंड / डीजे ब्रीफिंग 🥁","ALL"],["खाने का चखना पूरा 🍽️","ALL"],["बाहरी मेहमानों के लिए होटल बुकिंग 🏨","ALL"],["शादी का कार्यक्रम दोनों परिवारों से साझा 📋","ALL"],["आपातकालीन संपर्क सूची प्रिंट 📞","ALL"]]}],
 mr:[{m:"जून – जुलै",tag:"मोठे निर्णय पक्के करा",items:[["लग्न + रिसेप्शनच्या तारखा ठरवा","ALL"],["पाहुण्यांची ढोबळ संख्या ठरवा","ALL"],["एकूण बजेट ठरवा + वाटा","ALL"],["परदेशाहून येणाऱ्यांचं विमान बुक करा","ROMAFAM"],["सामायिक पाहुणे यादी सुरू करा","ROMAFAM"]]},
  {m:"ऑगस्ट",tag:"हॉल · केटरिंग · प्लॅनर",items:[["नाशिकमध्ये ३ हॉल निवडा","ROMAFAM"],["लेखी कोटेशन घ्या","ROMAFAM"],["लग्नाचा हॉल बुक करा + अनामत","ALL"],["केटरर निवडा + बुक करा","ROMAFAM"],["भरतपूर रिसेप्शन नवरदेवाकडून ठरवा","PRASHANTFAM"]]},
  {m:"सप्टेंबर",tag:"सजावट · पत्रिका · खरेदी",items:[["डेकोरेटर + रंगसंगती बुक करा","ALL"],["पत्रिका डिझाइन + ऑर्डर करा","ROMAFAM"],["व्हॉट्सअ‍ॅप डिजिटल पत्रिका बनवा","ROMAFAM"],["नवरीचा मुख्य पोशाख + अल्टरेशन","ROMAFAM"],["दागिने + अ‍ॅक्सेसरीज घ्या","ROMAFAM"],["रिटर्न गिफ्ट (तुळशीबाग)","ROMAFAM"]]},
  {m:"ऑक्टोबर",tag:"नवरीची तयारी · सर्व पक्कं करा",items:[["मेकअप आर्टिस्ट बुक + ट्रायल","ROMAFAM"],["मासिक फेशियल सुरू करा","ROMAFAM"],["मेहंदी + केस बुक करा","ROMAFAM"],["प्रत्येक वेंडर पुन्हा पक्का करा","ROMAFAM"],["फोटोग्राफर पक्का करा","ALL"]]},
  {m:"नोव्हेंबर",tag:"पाठवा · अंतिम · आनंद घ्या",items:[["व्हॉट्सअ‍ॅप पत्रिका पाठवा","ROMAFAM"],["अंतिम संख्या द्या","ROMAFAM"],["अल्टर केलेले कपडे आणा","ROMAFAM"],["नवरीची दिवसभराची बॅग भरा","ROMAFAM"],["शांत दिवस-प्रभारी नेमा","ALL"],["श्वास घ्या. आनंद घ्या.","ALL"]]},
  {m:"डिसेंबर",tag:"होतंय · शेवटचा टप्पा",items:[["अंतिम व्हेन्यू वॉकथ्रू — नाशिक + भरतपूर 🏛️","ALL"],["पाहुण्यांची संख्या निश्चित — दोन्ही बाजू 🧮","ALL"],["वधूचे अंतिम फिटिंग 👗","ALL"],["वराचे शेरवानी तयार 🧥","ALL"],["मेहंदी कलाकार निश्चित + वेळापत्रक 🌿","ALL"],["बँड / डीजे ब्रीफिंग 🥁","ALL"],["जेवणाची चव घेणे पूर्ण 🍽️","ALL"],["बाहेरगावच्या पाहुण्यांसाठी हॉटेल बुकिंग 🏨","ALL"],["लग्नाचा कार्यक्रम दोन्ही कुटुंबांना पाठवला 📋","ALL"],["आणीबाणी संपर्क यादी प्रिंट 📞","ALL"]]}],
};
const DECISIONS={
 en:[{id:"date",q:"Nashik reception dates confirmed: Dec 25–27. Bharatpur: Dec 10–14. All good?",opts:["Yes — locked ✅","Need to adjust one date","Still discussing"]},{id:"format",q:"Nashik event format?",opts:["Mehendi + Reception (2 days)","Full 3-day celebration","Keep it one evening"]},{id:"pune",q:"Leading Nashik venue type?",opts:["Lawns / open-air","Banquet hall","Still deciding"]},{id:"venue",q:"Guest travel — outstation accommodation?",opts:["Block hotel rooms for guests","Guests arrange themselves","Mix of both"]}],
 hi:[{id:"date",q:"नासिक: 25–27 दिसंबर, भरतपुर: 10–14 दिसंबर — सब ठीक?",opts:["हाँ — तय है ✅","एक तारीख़ बदलनी है","अभी बात हो रही है"]},{id:"format",q:"नासिक का कार्यक्रम?",opts:["मेहंदी + रिसेप्शन (2 दिन)","पूरा 3-दिन का उत्सव","एक शाम का कार्यक्रम"]},{id:"pune",q:"नासिक में वेन्यू का प्रकार?",opts:["लॉन्स / खुला वेन्यू","बैंक्वेट हॉल","अभी तय करना है"]},{id:"venue",q:"बाहर से आने वाले मेहमानों का ठहराव?",opts:["होटल रूम बुक करें","मेहमान खुद करेंगे","दोनों का मिश्रण"]}],
 mr:[{id:"date",q:"नाशिक: 25–27 डिसेंबर, भरतपूर: 10–14 डिसेंबर — सगळं ठीक?",opts:["हो — पक्कं ✅","एक तारीख बदलायची आहे","अजून बोलणं चालू आहे"]},{id:"format",q:"नाशिकचा कार्यक्रम?",opts:["मेहंदी + रिसेप्शन (2 दिवस)","पूर्ण 3-दिवसाचा उत्सव","एक संध्याकाळचा कार्यक्रम"]},{id:"pune",q:"नाशिकमध्ये वेन्यूचा प्रकार?",opts:["लॉन्स / मोकळा वेन्यू","बँक्वेट हॉल","अजून ठरवायचंय"]},{id:"venue",q:"बाहेरून येणाऱ्या पाहुण्यांची राहण्याची व्यवस्था?",opts:["हॉटेल रूम बुक करा","पाहुणे स्वतः करतील","दोन्हीचं मिश्रण"]}],
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
