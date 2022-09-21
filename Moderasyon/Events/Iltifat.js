const discord = require("discord.js");


let iltifatSayi = 0;
let iltifatlar = [
  "Yaşanılacak en güzel mevsim sensin.",
  "Sıradanlaşmış her şeyi, ne çok güzelleştiriyorsun.",
  "Gönlüm bir şehir ise o şehrin tüm sokakları sana çıkar.",
  "Birilerinin benim için ettiğinin en büyük kanıtı seninle karşılaşmam.",
  "Denize kıyısı olan şehrin huzuru birikmiş yüzüne.",
  "Ben çoktan şairdim ama senin gibi şiiri ilk defa dinliyorum.",
  "Gece yatağa yattığımda aklımda kalan tek gerçek şey sen oluyorsun.",
  "Ne tatlısın sen öyle. Akşam gel de iki bira içelim.",
  "Bir gamzen var sanki cennette bir çukur.",
  "Gecemi aydınlatan yıldızımsın.",
  "Ponçik burnundan ısırırım seni",
  "Bu dünyanın 8. harikası olma ihtimalin?",
  "Fıstık naber?",
  "Dilek tutman için yıldızların kayması mı gerekiyor illa ki? Gönlüm gönlüne kaydı yetmez mi?",
  "Süt içiyorum yarım yağlı, mutluluğum sana bağlı.",
  "Müsaitsen aklım bu gece sende kalacak.",
  "Gemim olsa ne yazar liman sen olmadıktan sonra...",
  "Gözlerimi senden alamıyorum çünkü benim tüm dünyam sensin.",
  "Sabahları görmek istediğim ilk şey sensin.",
  "Mutluluk ne diye sorsalar, cevabı gülüşünde ve o sıcak bakışında arardım.",
  "Hayatım ne kadar saçma olursa olsun, tüm hayallerimi destekleyecek bir kişi var. O da sensin, mükemmel insan.",
  "Bir adada mahsur kalmak isteyeceğim kişiler listemde en üst sırada sen varsın.",
  "Sesini duymaktan, hikayelerini dinlemekten asla bıkmayacağım. Konuşmaktan en çok zevk aldığım kişi sensin.",
  "Üzerinde pijama olsa bile, nasıl oluyor da her zaman bu kadar güzel görünüyorsun? Merhaba, neden bu kadar güzel olduğunu bilmek istiyorum.",
  "Çok yorulmuş olmalısın. Bütün gün aklımda dolaşıp durdun.",
  "Çocukluk yapsan da gönlüme senin için salıncak mı kursam?",
  "Sen birazcık huzur aradığımda gitmekten en çok hoşlandığım yersin.",
  "Hangi çiçek anlatır güzelliğini? Hangi mevsime sığar senin adın. Hiçbir şey yeterli değil senin güzelliğine erişmeye. Sen eşsizsin...",
  "Rotanızı geçen her geminin ışığıyla değil, yıldızlara göre ayarlayın.",
  "Telaşımı hoş gör, ıslandığım ilk yağmursun.",
  "Gülüşün ne güzel öyle, cumhuriyetin gelişi gibi...",
  "Ummmm. Klowra bunu sevdi... -SemirAŞK",
  "Aşk dediğimiz ilişki türünün bile anlatamadığı tek varlıksın. Evet, o sensin...",
  "Bu kadar tatlı olmaya devam edersen, benden sana torpil bebeğim.",
  "Atlasım ol gel dünya güzeli...",
  "Eğer bu mesaji yazdığım kişi sensen, evet senden bahsediyorum gözlerini kaçırma benden alloooo kime diyom bak buraya. Benden sana stat torpili dm gel bakim.",
  "Aşkım sarhoştum sen sandım özür dilerim. Beni affet...",
  "Aşk bir otobüstür binmesini bilmeli, son durağa gelmeden inmesini bilmeli.",
  "Bizde geri vites yok gerekirse ileriden döneriz...",
  "Ölüme gidelim dedin de mazot mu yok dedik ?",
  "Sen beni çok ararsın ama mumla cankuş...",
  "Sen çiğköfte ben lavaş sar beni yavaş yavaş.",
  "Oha sen! Alırım bir ömür...",
  "Giden gitmiştir gittiği gün bitmiştir. Sen gideni değil giden seni kaybetmiştir.",
  "Gözlerin gözlerimin gözlediği gözleri görseydi, gözlerinle gözlerim göz göze gelirdi.",
  "Sana uzaktan bakıyor artık gözlerim...",
  "Maziye bakma mevzu derin.",
  "Sen benim düşlerimin surete bürünmüş halisin.",
  "Bir sahil kasabasının huzuru birikmiş yüzüne.",
  "Gülüşünde nice ilaçlar var yarama merhem olan.",
  "Gece nasıl sabahı bekliyorsa aydınlanmak için ben de seni öyle bekliyorum.",
  "Mükemmeli sende gördüm ben. Kusursuz kelimesinin tam karşılığısın gönlümde.",
  "Bu dünya için sen çok fazlasın.",
  "Duyduğum en güzel şarkı senin sesinde. Piyanonun tuşlarında geziyor bazen parmaklarım, sana dokunuyorum. Kulağıma uğruyor piyanonun o hüzünlü sesi. Ama ben senin sesini duyuyorum. Sen güzel insan, bana bahşedilmiş en güzel armağansın. İyi ki varlığınla yücelttin ve şereflendirdin beni.",
  "Hediyelerin en güzelini almak istiyorum sana. Teninin üzerine gül yaprakları dökmek, ayağının altına kırmızı halılar sermek. Sen her şeye bedelsin sevgilim, sen her şeyin en güzeline layıksın. Ben seni hep çok mutlu etmeyi borç bildim kendime ve sen daima bana tebessüm etmelisin.",
  "Sen gözlerime her baktığında kalbim özgürlüğe kanat çırpan bir kuş misali heyecanlı ama bir o kadar da ürkek.",
  "Bu laf tüm chate Klowra'dandır. Kadınlar insan, biz insan oğlu.",
  "Ummmm. Poppy bunu sevdi... -Klowra",
  "Sütü ocakta, seni ...",
  "Yağmurdan sonra açan gök kuşağı gibisin, öyle güzel ve öyle özel!",
  "Cennetten mi düştün acaba ?",
  "Sil ağzının kenarını, yine gülüşünden cennet akıyor..."
];

module.exports = (message) => {
  if (message.channel.name === global.sunucuAyar.chatKanali && !message.author.bot) {
    iltifatSayi++; 
    if (iltifatSayi >= 200) {
      iltifatSayi = 0;
      message.lineReply(iltifatlar.random());
    };
  };
};

module.exports.configuration = {
  name: "message"
};