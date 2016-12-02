TE.each(function($) {

    var _u2026 = '\u2026',
        _u2013 = '\u2013',

        has_note_tool = !!$.ui.tools.note;

    $.update({
        languages: {
            tools: {
                tools: ['Fokus ke Alat'],
                clear: ['Hapus Format'],
                b: ['Tebal'],
                i: ['Miring'],
                u: ['Garis Bawah'],
                s: ['Coret'],
                a: ['Tautan'],
                img: ['Gambar'],
                sub: ['Subskrip'],
                sup: ['Superskrip'],
                note: ['Catatan Kaki'],
                abbr: ['Singkatan'],
                p: ['Paragraf'],
                br: ['Ganti Baris'],
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
                redo: ['Lakukan Lagi']
            },
            modals: {
                a: {
                    title: [has_note_tool ? 'URL/Referensi Tautan' : 'URL Tautan', 'Judul Tautan'],
                    placeholder: ['http://', 'judul tautan di sini' + _u2026]
                },
                img: {
                    title: [has_note_tool ? 'URL/Referensi Gambar' : 'URL Gambar', 'Judul Gambar', 'Keterangan Gambar'],
                    placeholder: ['http://', 'judul gambar di sini' + _u2026, 'keterangan gambar di sini' + _u2026]
                },
                note: {
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
            }
        }
    }, 0);

});