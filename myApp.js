require('dotenv').config(); // Muat variabel lingkungan dari .env agar Mongoose bisa membaca URI
const mongoose = require('mongoose'); // Impor pustaka Mongoose untuk berinteraksi dengan MongoDB

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Buka koneksi ke MongoDB menggunakan opsi koneksi modern

const personSchema = new mongoose.Schema({ // Definisikan skema untuk koleksi Person
  name: String, // Simpan nama sebagai string
  age: Number, // Simpan usia sebagai number
  favoriteFoods: [String] // Simpan makanan favorit dalam array string
}); // Akhiri deklarasi skema

const Person = mongoose.model('Person', personSchema); // Kompilasi skema menjadi model Person yang dapat dipakai ulang

/** 3) Create and Save a Person */ // Komentar deskripsi tugas FreeCodeCamp
const createAndSavePerson = function(done) { // Buat satu dokumen Person kemudian simpan
  const aesSaputra = new Person({ name: "Aes Saputra", age: 21, favoriteFoods: ["eggs", "fish", "fresh fruit"] }); // Instansiasi Person dengan data contoh

  aesSaputra.save(function(err, data) { // Simpan instance Person ke database
    if (err) { // Periksa apakah operasi simpan gagal
      return done(err, null); // Kembalikan error melalui callback lalu hentikan
    } // Tutup blok pengecekan error
    return done(null, data); // Kembalikan dokumen yang berhasil disimpan melalui callback
  }); // Tutup pemanggilan janeFonda.save
}; // Tutup definisi fungsi createAndSavePerson

const createManyPeople = (arrayOfPeople, done) => { // Buat banyak dokumen Person dari sebuah array
  Person.create(arrayOfPeople, (err, data) => { // Masukkan seluruh dokumen dalam satu operasi batch
    if (err) return done(err); // Segera kembalikan error lewat callback bila insert gagal
    done(null, data); // Kembalikan daftar dokumen yang berhasil dibuat
  }); // Tutup pemanggilan Person.create
}; // Tutup definisi fungsi createManyPeople

const findPeopleByName = (personName, done) => { // Cari semua Person yang namanya cocok
  Person.find({ name: personName }, (err, people) => { // Jalankan kueri berdasarkan kolom name
    if (err) return done(err); // Kembalikan error bila kueri gagal
    return done(null, people); // Kembalikan array dokumen yang cocok
  }); // Tutup pemanggilan Person.find
}; // Tutup definisi fungsi findPeopleByName

const findOneByFood = (food, done) => { // Cari satu Person yang menyukai makanan tertentu
  Person.findOne({ favoriteFoods: food }, (err, person) => { // Jalankan kueri pertama yang menemukan makanan favorit tersebut
    if (err) return done(err); // Kembalikan error bila kueri gagal
    return done(null, person); // Kembalikan dokumen yang ditemukan
  }); // Tutup pemanggilan Person.findOne
}; // Tutup definisi fungsi findOneByFood

const findPersonById = (personId, done) => { // Cari Person berdasarkan _id unik
  Person.findById(personId, (err, person) => { // Jalankan pencarian langsung memakai _id
    if (err) return done(err); // Kembalikan error bila pencarian gagal
    return done(null, person); // Kembalikan dokumen yang ditemukan
  }); // Tutup pemanggilan Person.findById
}; // Tutup definisi fungsi findPersonById

const findEditThenSave = (personId, done) => { // Temukan Person, ubah datanya, lalu simpan kembali
  const foodToAdd = "hamburger"; // Tentukan makanan yang ingin ditambahkan ke daftar favorit

  Person.findById(personId, (err, person) => { // Ambil Person berdasarkan _id
    if (err) return done(err); // Kembalikan error bila pencarian gagal
    if (!person) return done(null, null); // Kembalikan null bila Person tidak ditemukan

    person.favoriteFoods = person.favoriteFoods || []; // Pastikan favoriteFoods berupa array sebelum diubah
    person.favoriteFoods.push(foodToAdd); // Tambahkan makanan baru ke daftar favorit

    person.save((saveErr, updatedPerson) => { // Simpan kembali dokumen yang telah dimodifikasi
      if (saveErr) return done(saveErr); // Kembalikan error bila proses simpan gagal
      return done(null, updatedPerson); // Kembalikan dokumen Person yang sudah diperbarui
    }); // Tutup pemanggilan person.save
  }); // Tutup callback Person.findById
}; // Tutup definisi fungsi findEditThenSave

const findAndUpdate = (personName, done) => { // Perbarui usia Person dengan satu kueri atomik
  const ageToSet = 20; // Tetapkan nilai usia baru

  Person.findOneAndUpdate( // Jalankan operasi find-and-update dalam satu langkah
    { name: personName }, // Cari dokumen berdasarkan nama
    { age: ageToSet }, // Setel perubahan usia
    { new: true }, // Minta dokumen terbaru sebagai hasil
    (err, updatedPerson) => { // Tangani hasil operasi pembaruan
      if (err) return done(err); // Kembalikan error bila update gagal
      return done(null, updatedPerson); // Kembalikan dokumen Person yang sudah diperbarui
    } // Tutup callback findOneAndUpdate
  ); // Tutup pemanggilan Person.findOneAndUpdate
}; // Tutup definisi fungsi findAndUpdate

const removeById = (personId, done) => { // Hapus satu Person memakai _id
  Person.findByIdAndRemove(personId, (err, removedPerson) => { // Hapus dokumen dan ambil data yang dihapus
    if (err) return done(err); // Kembalikan error bila penghapusan gagal
    return done(null, removedPerson); // Kembalikan dokumen yang sudah dihapus untuk konfirmasi
  }); // Tutup pemanggilan Person.findByIdAndRemove
}; // Tutup definisi fungsi removeById

const removeManyPeople = (done) => { // Hapus banyak Person yang memenuhi kriteria tertentu
  const nameToRemove = "Mary"; // Nama yang menjadi syarat penghapusan

  Person.remove({ name: nameToRemove }, (err, result) => { // Jalankan penghapusan massal berdasarkan nama
    if (err) return done(err); // Kembalikan error bila operasi gagal
    return done(null, result); // Kembalikan ringkasan hasil penghapusan
  }); // Tutup pemanggilan Person.remove
}; // Tutup definisi fungsi removeManyPeople

const queryChain = (done) => { // Tampilkan contoh kueri berantai dengan filter dan bentuk hasil
  const foodToSearch = "burrito"; // Makanan favorit yang dijadikan filter

  Person.find({ favoriteFoods: foodToSearch }) // Mulai kueri untuk mencari penyuka makanan tersebut
    .sort({ name: 1 }) // Urutkan hasil secara alfabet berdasar nama
    .limit(2) // Batasi hasil hanya dua dokumen pertama
    .select({ age: 0 }) // Sembunyikan kolom age dari hasil
    .exec((err, people) => { // Eksekusi kueri dan tangani hasilnya
      if (err) return done(err); // Kembalikan error bila eksekusi gagal
      return done(null, people); // Kembalikan daftar dokumen yang sudah difilter dan diformat
    }); // Tutup pemanggilan exec
}; // Tutup definisi fungsi queryChain

/** **Kerja Bagus !!**
/* Kamu menuntaskan tantangan ini, ayo rayakan !
 */ // Komentar motivasi bawaan FreeCodeCamp

//----- **JANGAN UBAH BAGIAN DI BAWAH INI** ---------------------------------- // Pengingat agar bagian ekspor tetap utuh

exports.PersonModel = Person; // Ekspor model Person untuk penggunaan luar atau pengujian
exports.createAndSavePerson = createAndSavePerson; // Ekspor helper createAndSavePerson
exports.findPeopleByName = findPeopleByName; // Ekspor helper findPeopleByName
exports.findOneByFood = findOneByFood; // Ekspor helper findOneByFood
exports.findPersonById = findPersonById; // Ekspor helper findPersonById
exports.findEditThenSave = findEditThenSave; // Ekspor helper findEditThenSave
exports.findAndUpdate = findAndUpdate; // Ekspor helper findAndUpdate
exports.createManyPeople = createManyPeople; // Ekspor helper createManyPeople
exports.removeById = removeById; // Ekspor helper removeById
exports.removeManyPeople = removeManyPeople; // Ekspor helper removeManyPeople
exports.queryChain = queryChain; // Ekspor helper queryChain
