TE.each(function($) {

    var syntax = $.is(/^html$/i) === false,

        _u2026 = '\u2026',
        _u2013 = '\u2013';

    $.update({
        languages: {
            tools: {
                clear: ['Hapus Format'],
                b: ['Tebal'],
                i: ['Miring'],
                u: ['Garis Bawah'],
                s: ['Coret'],
                a: ['Tautan'],
                img: ['Gambar'],
                sub: ['Subskrip'],
                sup: [syntax ? 'Catatan Kaki' : 'Superskrip'],
                abbr: ['Singkatan'],
                p: ['Paragraf'],
                'p,h1,h2,h3,h4,h5,h6': ['H1 ' + _u2013 + ' H6'],
                'blockquote,q': ['Kutipan'],
                'pre,code': ['Kode'],
                ul: ['Daftar Tak Berangka'],
                ol: ['Daftar Berangka'],
                indent: ['Tambahkan Tab'],
                outdent: ['Kurangi Tab'],
                table: ['Tabel'],
                hr: ['Garis Horizontal'],
                undo: ['Batal'],
                redo: ['Lakukan Lagi'],
                preview: ['Pratinjau']
            },
            modals: {
                a: {
                    title: [syntax ? 'URL/Referensi Tautan' : 'URL Tautan', 'Judul Tautan'],
                    placeholder: ['http://', 'judul tautan di sini' + _u2026]
                },
                img: {
                    title: [syntax ? 'URL/Referensi Gambar' : 'URL Gambar', 'Judul Gambar', 'Keterangan Gambar'],
                    placeholder: ['http://', 'judul gambar di sini' + _u2026, 'keterangan gambar di sini' + _u2026]
                },
                sup: {
                    title: 'ID Catatan Kaki'
                },
                abbr: {
                    title: 'Singkatan',
                    placeholder: 'arti singkatan di sini' + _u2026
                },
                table: {
                    title: ['Jumlah Kolom', 'Jumlah Baris', 'Keterangan Tabel'],
                    placeholder: ['3', '3', 'keterangan tabel di sini' + _u2026]
                }
            },
            buttons: {
                okay: 'Oke',
                cancel: 'Batal',
                yes: 'Ya',
                no: 'Tidak',
                enter: 'Masuk',
                exit: 'Keluar',
                open: 'Buka',
                close: 'Tutup',
                ignore: 'Abaikan'
            },
            placeholders: {
                "": 'teks di sini' + _u2026,
                table: ['Kepala Tabel %1.%2', 'Data Tabel %1.%2  ', 'Kaki Tabel %1.%2  ']
            },
            others: {
                preview: 'Pratinjau',
                _word: '%1 Kata',
                _words: '%1 Kata'
            }
        }
    }, 0);

});