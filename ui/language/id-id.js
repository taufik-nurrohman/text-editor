TE.each(function($) {

    var _u2013 = '\u2013', // N-dash
        _u2026 = '\u2026', // horizontal ellipsis
        _u2191 = '\u2191', // upwards arrow
        _u2193 = '\u2193', // downwards arrow
        _u21B5 = '\u21B5', // carriage return arrow
        _u2318 = '\u2318', // command sign
        _u2718 = '\u2718', // delete sign
        _u21E5 = '\u21E5', // indent sign
        _u21E7 = '\u21E7', // shift sign
        _u2325 = '\u2325', // option sign

        markdown = $.type === 'Markdown';

    $.update({
        languages: {
            tools: {
                clear: 'Hapus Format (' + _u2718 + ')',
                b: 'Tebal (' + _u2318 + '+B)',
                i: 'Miring (' + _u2318 + '+I)',
                u: 'Garis Bawah (' + _u2318 + '+U)',
                s: 'Coret (' + _u2318 + '+' + _u2718 + ')',
                a: 'Tautan (' + _u2318 + '+L)',
                img: 'Gambar (' + _u2318 + '+G)',
                sub: 'Subskrip (' + _u2318 + '+' + _u2193 + ')',
                sup: markdown ? 'Catatan Kaki (' + _u2318 + '+' + _u2193 + ')' : 'Superskrip (' + _u2318 + '+' + _u2191 + ')',
                abbr: 'Singkatan (' + _u2318 + '+' + _u21E7 + '+?)',
                p: 'Paragraf (' + _u2318 + '+' + _u21B5 + ')',
                'p,h1,h2,h3,h4,h5,h6': 'H1 ' + _u2013 + ' H6 (' + _u2318 + '+H)',
                'blockquote,q': 'Kutipan (' + _u2318 + '+Q)',
                'pre,code': 'Kode (' + _u2318 + '+K)',
                ul: 'Daftar Tak Berangka (' + _u2318 + '+-)',
                ol: 'Daftar Berangka (' + _u2318 + '++)',
                indent: 'Tambahkan Tab (' + _u21E5 + ')',
                outdent: 'Kurangi Tab (' + _u21E7 + '+' + _u21E5 + ')',
                table: 'Tabel (' + _u2318 + '+T)',
                hr: 'Garis Horizontal (' + _u2318 + '+R)',
                undo: 'Batal (' + _u2318 + '+Z)',
                redo: 'Lakukan Lagi (' + _u2318 + '+Y)',
                preview: 'Pratinjau (' + _u2318 + '+' + _u2325 + '+V)'
            },
            modals: {
                a: {
                    title: [markdown ? 'URL/Referensi Tautan' : 'URL Tautan', 'Judul Tautan'],
                    placeholder: ['http://', 'judul tautan di sini' + _u2026]
                },
                img: {
                    title: [markdown ? 'URL/Referensi Gambar' : 'URL Gambar', 'Judul Gambar', 'Keterangan Gambar'],
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