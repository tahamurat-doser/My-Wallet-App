//? Selectors(Seçiciler) (jd daha çok ıd css de class kullanılır)
const ekleBtn = document.getElementById("ekle-btn");
const gelirInput = document.getElementById("gelir-input");
const ekleFormu = document.getElementById("ekle-formu");

const gelirinizTd = document.getElementById("geliriniz");
const giderinizTd = document.getElementById("gideriniz");
const kalanTd = document.getElementById("kalan");

//? Variables
let gelirler = 0;
let harcamaListesi = []; //! obje olarak oluşturduğum yeniharcama listesini bu dizi içine push layacağım

window.addEventListener("load", () => {
  //&sayfa tekrar yüklendiğinde localst den gelirlerindeğerini alıyorum tekrar td deki gelirler kısmına atıyorum eğer gelirle kısmı boş ise 0 yazdırması için || bunu kullanıyorum
  gelirler = Number(localStorage.getItem("gelirler")) || 0;
  gelirinizTd.textContent = gelirler;
  tarihInput.valueAsDate = new Date(); //! bugünün tarihini otomatik olrak sayfa yüklendiğinde yazdırması için yaptım
  harcamaListesi = JSON.parse(localStorage.getItem("harcama listesi")) || [] //&burada localstr deki string formatında tutlan verimizi çağırıyoruz ve onu json.parse ile tekrar json formatna çeviriyoruz sonrada görebilmek için doma basacağız.
  hesaplaVeGuncelle()

  harcamaListesi.forEach(harcama => {
    harcamayiDomaYaz(harcama)

    
  });//! bu yazdığımızla tekrar yüklendiğinde listenin localstr den doma yazdırılmasını sağlıyoruz.

});

//? EKLE FORMU
ekleFormu.addEventListener("submit", (e) => {
  e.preventDefault(); //! bunun submit özelliğini engellemek için kullandık event i yakaladık
  gelirler = gelirler + Number(gelirInput.value); //!input tan veri sitring olarak geliyor.
  console.log(gelirler);
  ekleFormu.reset(); //! formun rest özelliği ile işlem bitince içini temizliyoruz. bu yüzden de ekleBtn yerine yukarda formu yakalyıp onun kullanıyoruz
  localStorage.setItem("gelirler", gelirler); //! localstorege ı setıtem ile gönderiyorum
  hesaplaVeGuncelle()
 

}); //! anlık olarak gelip gitme oluyor bunu değiştirmemiz gerekiyor. form ların bir özelliği.reventDefault

//? Harcama Alanı
const harcamaFormu = document.getElementById("harcama-formu");
const harcamaAlani = document.getElementById("harcama-alani");
const tarihInput = document.getElementById("tarih");
const miktarInput = document.getElementById("miktar");

const harcamaBody = document.getElementById("harcama-body");
const temizleBtn = document.getElementById("temizle-btn");

harcamaFormu.addEventListener("submit", (e) => {
  e.preventDefault(); //! reload u engellemek için
  const yeniHarcama = {
    //! tablodan gelecek verileri obje olarak saklamak için key value şeklinde property ler oluşturuyorum.
    tarih: tarihInput.value,
    miktar: miktarInput.value,
    alan: harcamaAlani.value,
    id: new Date().getTime(), //! unix saati ile uni değerler oluşturuyorum böylece silmek istediğimde bu kaydı işime yarayacak
  };
  /*  console.log(yeniHarcama); */
  harcamaListesi.push(yeniHarcama);
  /*  console.log(harcamaListesi); */
  harcamayiDomaYaz(yeniHarcama);
  harcamaFormu.reset();
  tarihInput.valueAsDate = new Date(); //! bugünün tarihini otomatik olrak sayfa yüklendiğinde yazdırması için yaptım
  localStorage.setItem("harcama listesi", JSON.stringify(harcamaListesi)); //! localstr e harcama listesini kaydediyorum ve localstr kayıtları string tuttuğu için json.stringfyl ile json formatına alıp stringleştirdim.
  hesaplaVeGuncelle()
});

//! harcamayı doma yazdıracak bir fonksiyon oluşturuyorum, çünkü bu işlem birçok kez tekrar edecek fonksiyon ile yapmak daha mantıklı

const harcamayiDomaYaz = ({ id, miktar, tarih, alan }) => {
  //!verinin açılması gerekiyor oyüzden detraction yöntemini kullanacağım
  /*  const {id, miktar, tarih, alan} = yeniHarcama */ //& havada destract uygulamak için fonksiyondaki yeniHarcama yazanayere yani parametre yazılan yere süslüyü koyuyorum
  //! 1. yöntem
  /*   harcamaBody.innerHTML +=` //& innerHtml kullanmıyoruz uzun yoldan yapacağız.
    <tr>
       <td>${tarih}</td>
       <td>${alan}</td>
       <td>${miktar}</td>
       <td><i id=${id} class="fa-solid fa-trash-can text-danger"  type="button"></i></td>


    </tr>   
    ` */
  //! 2.yöntem
  const tr = document.createElement("tr");
  const appendTd = (content) => {
    //! burada oluşturduğum tr nin içine göndereceğim td elementlerini oluşturacak bir fonksiyon yazıyorum. içine alan göderince alan td isi tarih gönderince tarih td miktar gönderince miktar td si oluşturacak.
    const td = document.createElement("td");
    td.textContent = content;
    return td;
  };

  const createLastTd = () => {
    const td = document.createElement("td"); //! silme kısmında bir td elementi ve bir de silme için buton oluşturduğum için bunu ayrı yapıyorum
    const iElement = document.createElement("i");
    iElement.id = id; //! i elementinin id si yukarda destract ettiğimiz id olacak
    iElement.className = "fa-solid fa-trash-can text-danger"; //! i elementine bir class name atadım
    iElement.type = "button"; //! i elemetinin tipi button
    td.appendChild(iElement); //! ielementini önce td ye bağladım daha sonrada td yi tr ye bağladım
    return td;
  };

  tr.append(
    appendTd(tarih), //tarih td si
    appendTd(miktar), // miktar td si
    appendTd(alan), //alan td si
    createLastTd() //çöp kutusu ve id yi ekler
  );

  harcamaBody.prepend(tr); //& son girileni alta ekliyor prepend(tr) yapsaydık başa ekleycekti
};

const hesaplaVeGuncelle = () => {
  const giderler = harcamaListesi.reduce((toplam, harcama) => toplam + Number(harcama.miktar), 0)
  /* console.log(giderler); */
  giderinizTd.textContent = giderler
  gelirinizTd.textContent = gelirler
  kalanTd.textContent = gelirler - giderler
}

//? Silme işlemi

harcamaBody.addEventListener("click", (e) =>{
  /* console.log(e.target.classList.contains("fa-trash-can")); *///! Eğer tıladığım yer de bir çöp kutusu kılası tanımlandı ise dedim.

  if (e.target.classList.contains("fa-trash-can")) {
    e.target.parentElement.parentElement.remove()//& paren elementin parent elementini siliyoruö çünkü satırın tamamını silmem gerkiyor yani tr yi siliyorum.localstr den silmedik daha.
    const tıklananId = e.target.id
    harcamaListesi = harcamaListesi.filter((harcama) => harcama.id != tıklananId) 
    console.log(harcamaListesi);
    localStorage.setItem("harcama listesi", JSON.stringify(harcamaListesi))
  }
 

})

temizleBtn.addEventListener("click", () => {
  if (confirm("Tüm veriler silinecek. Devem etmek istiyor musun?"))
  harcamaListesi = []
gelirler = 0
harcamaBody.innerHTML = ""
localStorage.removeItem("gelirler")
localStorage.removeItem("harcama listesi")
/* localStorage.clear() */ //! tümlocalsrt yi siler
hesaplaVeGuncelle()
})
