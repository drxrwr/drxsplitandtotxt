# VCF Splitter & Converter

Tool browser untuk memecah file VCF dan mengubah nomor telepon dari VCF menjadi TXT. File diproses di perangkat sendiri, tanpa diunggah ke server.

## Split VCF

1. Pilih satu file VCF pada bagian **Split VCF**.
2. Isi **Contacts per file** dengan jumlah kontak untuk setiap file hasil.
3. Isi **Nomor Awal** untuk nomor file pertama; nilai awalnya `1`.
4. Isi **File name** jika ingin memberi awalan nama.
5. Isi **Additional file name** jika ingin menambahkan teks setelah nomor file.
6. Klik **Split VCF**, lalu klik tautan setiap file hasil untuk mengunduh.

Aturan penamaan mengikuti referensi https://tepanne.github.io/SplitAndCvVcfToTXt/:

| File name | Nomor Awal | Additional file name | Hasil pertama |
| --- | --- | --- | --- |
| kosong | 1 | kosong | `1.vcf` |
| `DATA` | 3 | kosong | `DATA3.vcf` |
| `DATA-` | 3 | kosong | `DATA-3.vcf` |
| `DATA§` | 3 | kosong | `DATA 3.vcf` |
| `DATA§` | 3 | `MY` | `DATA 3 MY.vcf` |

Tanda `§` memberi spasi antara awalan dan nomor. Seperti referensi, hanya teks sebelum `§` yang dipakai sebagai awalan. Nomor berikutnya bertambah satu. Sisa kontak yang kurang dari jumlah per file tetap disimpan dalam file terakhir. Nama dan isi kontak di dalam VCF dipertahankan.

## Convert VCF to TXT

1. Pilih satu file VCF pada bagian **Convert VCF to TXT**.
2. Isi **Output file name** jika ingin menentukan nama hasil.
3. Klik **Convert to TXT**. Nomor telepon dan jumlah nomor muncul setelah tombol ini diklik.
4. Klik **Download TXT** untuk mengunduh.

Nama hasil bawaan adalah `output.txt`. Nama yang diisi mendapat tambahan `.txt`. Nomor ditulis satu per baris; tanda `+`, urutan, dan nomor duplikat dipertahankan. Format `TEL:`, `TEL;TYPE=CELL:`, properti TEL berkelompok, dan URI `tel:` didukung. Jika satu kontak punya beberapa nomor, semua nomor dimasukkan.

## Menjalankan

Buka `index.html` di browser modern atau gunakan hosting statis. Tidak memerlukan instalasi paket, backend, ataupun API key.
