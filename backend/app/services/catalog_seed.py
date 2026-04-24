"""
Data seeding script for catalog items.
Populates the database with default triggers and actions.
"""
from sqlalchemy.orm import Session
from app.models.catalog_model import CatalogItem
from app.schemas.catalog_schema import CatalogItemCreate
from app.services.catalog_service import CatalogService


DEFAULT_TRIGGERS = [
    CatalogItemCreate(
        icon_key="bell",
        name="Notifikasi SIX",
        description="Aktif ketika ada pengumuman atau pemberitahuan baru dari sistem SIX.",
        category="trigger",
        item_type="Event",
        action_key=None,
        parameter_schema={
            "fields": [
                {
                    "key": "event_type",
                    "label": "Jenis Notifikasi",
                    "type": "select",
                    "required": True,
                    "options": [
                        {"value": "announcement", "label": "Pengumuman"},
                        {"value": "grade_update", "label": "Pembaruan Nilai"},
                        {"value": "schedule_change", "label": "Perubahan Jadwal"},
                        {"value": "all", "label": "Semua Notifikasi"},
                    ],
                },
                {
                    "key": "target_role",
                    "label": "Target Penerima",
                    "type": "select",
                    "required": True,
                    "options": [
                        {"value": "mahasiswa", "label": "Mahasiswa"},
                        {"value": "dosen", "label": "Dosen"},
                        {"value": "all", "label": "Semua"},
                    ],
                },
            ]
        },
    ),
    CatalogItemCreate(
        icon_key="clock",
        name="Jadwal SIX",
        description="Memicu otomatisasi berdasarkan kalender akademik atau jadwal perkuliahan.",
        category="trigger",
        item_type="Schedule",
        action_key=None,
        parameter_schema={
            "fields": [
                {
                    "key": "cron_expression",
                    "label": "Jadwal (Cron Expression)",
                    "type": "text",
                    "placeholder": "0 8 * * 1-5",
                    "required": True,
                    "hint": "Format: menit jam hari bulan hari-dalam-minggu. Contoh: '0 8 * * 1' = Setiap Senin pukul 08.00",
                },
                {
                    "key": "timezone",
                    "label": "Zona Waktu",
                    "type": "select",
                    "required": False,
                    "options": [
                        {"value": "Asia/Jakarta", "label": "WIB (Asia/Jakarta)"},
                        {"value": "Asia/Makassar", "label": "WITA (Asia/Makassar)"},
                        {"value": "Asia/Jayapura", "label": "WIT (Asia/Jayapura)"},
                    ],
                },
            ]
        },
    ),
    CatalogItemCreate(
        icon_key="zap",
        name="Permasalahan UKT",
        description="Berjalan ketika ada laporan kendala, penangguhan, atau keterlambatan pembayaran UKT.",
        category="trigger",
        item_type="Event",
        action_key=None,
        parameter_schema={
            "fields": [
                {
                    "key": "problem_type",
                    "label": "Jenis Masalah",
                    "type": "select",
                    "required": True,
                    "options": [
                        {"value": "late_payment", "label": "Keterlambatan Pembayaran"},
                        {"value": "suspension", "label": "Penangguhan"},
                        {"value": "dispute", "label": "Laporan Kendala"},
                        {"value": "all", "label": "Semua Jenis"},
                    ],
                },
                {
                    "key": "overdue_days",
                    "label": "Batas Hari Keterlambatan",
                    "type": "number",
                    "placeholder": "7",
                    "required": False,
                    "hint": "Trigger aktif jika pembayaran terlambat lebih dari N hari",
                },
            ]
        },
    ),
    CatalogItemCreate(
        icon_key="refresh",
        name="Perubahan Jadwal Kelas",
        description="Terpicu otomatis saat dosen memindahkan jam atau ruang kelas perkuliahan.",
        category="trigger",
        item_type="Event",
        action_key=None,
        parameter_schema={
            "fields": [
                {
                    "key": "course_code",
                    "label": "Kode Mata Kuliah",
                    "type": "text",
                    "placeholder": "IF3250",
                    "required": False,
                    "hint": "Kosongkan untuk memantau semua mata kuliah",
                },
                {
                    "key": "change_type",
                    "label": "Jenis Perubahan",
                    "type": "select",
                    "required": False,
                    "options": [
                        {"value": "time", "label": "Perubahan Jam"},
                        {"value": "room", "label": "Perubahan Ruangan"},
                        {"value": "cancellation", "label": "Pembatalan Kelas"},
                        {"value": "all", "label": "Semua Perubahan"},
                    ],
                },
            ]
        },
    ),
    CatalogItemCreate(
        icon_key="users",
        name="Aktivitas Dosen",
        description="Mendeteksi perubahan status atau pembaruan materi yang dilakukan oleh dosen pengampu.",
        category="trigger",
        item_type="Event",
        action_key=None,
        parameter_schema={
            "fields": [
                {
                    "key": "activity_type",
                    "label": "Jenis Aktivitas",
                    "type": "select",
                    "required": True,
                    "options": [
                        {"value": "material_upload", "label": "Upload Materi"},
                        {"value": "grade_input", "label": "Input Nilai"},
                        {"value": "status_change", "label": "Perubahan Status"},
                        {"value": "all", "label": "Semua Aktivitas"},
                    ],
                },
                {
                    "key": "lecturer_id",
                    "label": "NIP Dosen",
                    "type": "text",
                    "placeholder": "198XXXXXXXX",
                    "required": False,
                    "hint": "Kosongkan untuk memantau semua dosen",
                },
            ]
        },
    ),
    CatalogItemCreate(
        icon_key="checkCircle",
        name="Pembukaan Absensi",
        description="Terpicu saat dosen membuka sesi presensi mandiri untuk kelas yang sedang berlangsung.",
        category="trigger",
        item_type="Event",
        action_key=None,
        parameter_schema={
            "fields": [
                {
                    "key": "course_code",
                    "label": "Kode Mata Kuliah",
                    "type": "text",
                    "placeholder": "IF3250",
                    "required": False,
                    "hint": "Kosongkan untuk semua mata kuliah",
                },
                {
                    "key": "notify_before_minutes",
                    "label": "Notifikasi Sebelum Tutup (menit)",
                    "type": "number",
                    "placeholder": "10",
                    "required": False,
                    "hint": "Kirim pengingat N menit sebelum presensi ditutup",
                },
            ]
        },
    ),
]

DEFAULT_ACTIONS = [
    CatalogItemCreate(
        icon_key="mail",
        name="Notifikasi ke Email",
        description="Mengirimkan pesan otomatis ke email std.stei.itb.ac.id mahasiswa atau dosen.",
        category="action",
        item_type="API",
        action_key="send_email",
        parameter_schema={
            "fields": [
                {
                    "key": "recipient_type",
                    "label": "Penerima",
                    "type": "select",
                    "required": True,
                    "options": [
                        {"value": "mahasiswa", "label": "Mahasiswa"},
                        {"value": "dosen", "label": "Dosen"},
                        {"value": "custom", "label": "Email Kustom"},
                    ],
                },
                {
                    "key": "recipient_email",
                    "label": "Email (jika Kustom)",
                    "type": "email",
                    "placeholder": "contoh@itb.ac.id",
                    "required": False,
                    "hint": "Hanya diisi jika penerima adalah Email Kustom",
                },
                {
                    "key": "subject",
                    "label": "Subjek Email",
                    "type": "text",
                    "placeholder": "Pemberitahuan dari Ditdik ITB",
                    "required": True,
                },
                {
                    "key": "body_template",
                    "label": "Isi Email",
                    "type": "textarea",
                    "placeholder": "Halo {name}, ...",
                    "required": True,
                    "hint": "Gunakan {variabel} untuk menyisipkan data dari trigger",
                },
            ]
        },
    ),
    CatalogItemCreate(
        icon_key="msg",
        name="Notifikasi ke WhatsApp",
        description="Mengirimkan pesan instan atau pengingat jadwal melalui WhatsApp.",
        category="action",
        item_type="Webhook",
        action_key="send_whatsapp",
        parameter_schema={
            "fields": [
                {
                    "key": "to",
                    "label": "Nomor Tujuan",
                    "type": "text",
                    "placeholder": "+6281234567890",
                    "required": True,
                    "hint": "Format internasional, contoh: +6281234567890",
                },
                {
                    "key": "message_template",
                    "label": "Template Pesan",
                    "type": "textarea",
                    "placeholder": "Halo {name}, jadwal kelas {course} berubah ke {new_time}.",
                    "required": True,
                    "hint": "Gunakan {variabel} untuk menyisipkan data dari trigger",
                },
                {
                    "key": "provider_url",
                    "label": "URL Provider WhatsApp",
                    "type": "text",
                    "placeholder": "https://api.provider.com/send",
                    "required": True,
                },
                {
                    "key": "api_token",
                    "label": "API Token",
                    "type": "text",
                    "placeholder": "Bearer token dari provider",
                    "required": False,
                },
            ]
        },
    ),
    CatalogItemCreate(
        icon_key="fileText",
        name="Generate PDF",
        description="Membuat dokumen PDF secara otomatis seperti transkrip akademik atau surat keterangan.",
        category="action",
        item_type="API",
        action_key="generate_pdf",
        parameter_schema={
            "fields": [
                {
                    "key": "template_type",
                    "label": "Jenis Dokumen",
                    "type": "select",
                    "required": True,
                    "options": [
                        {"value": "transcript", "label": "Transkrip Akademik"},
                        {"value": "certificate", "label": "Surat Keterangan"},
                        {"value": "report", "label": "Laporan"},
                    ],
                },
                {
                    "key": "output_filename",
                    "label": "Nama File Output",
                    "type": "text",
                    "placeholder": "transkrip_{nim}_{date}",
                    "required": False,
                    "hint": "Gunakan {variabel} untuk nama file dinamis",
                },
                {
                    "key": "send_to_email",
                    "label": "Kirim ke Email",
                    "type": "checkbox",
                    "required": False,
                    "hint": "Centang untuk mengirim PDF ke email terkait setelah dibuat",
                },
            ]
        },
    ),
    CatalogItemCreate(
        icon_key="edit",
        name="Resize Gambar",
        description="Menyesuaikan ukuran dan kompresi file gambar untuk keperluan pasfoto profil SIX.",
        category="action",
        item_type="API",
        action_key="compress_image",
        parameter_schema={
            "fields": [
                {
                    "key": "max_width",
                    "label": "Lebar Maksimum (px)",
                    "type": "number",
                    "placeholder": "800",
                    "required": True,
                },
                {
                    "key": "max_height",
                    "label": "Tinggi Maksimum (px)",
                    "type": "number",
                    "placeholder": "800",
                    "required": True,
                },
                {
                    "key": "quality",
                    "label": "Kualitas (1–100)",
                    "type": "number",
                    "placeholder": "85",
                    "required": False,
                    "hint": "Nilai lebih rendah = ukuran file lebih kecil",
                },
                {
                    "key": "output_format",
                    "label": "Format Output",
                    "type": "select",
                    "required": False,
                    "options": [
                        {"value": "jpeg", "label": "JPEG"},
                        {"value": "png", "label": "PNG"},
                        {"value": "webp", "label": "WebP"},
                    ],
                },
            ]
        },
    ),
]

def seed_catalog_items(db: Session) -> None:
    db.query(CatalogItem).delete()
    db.commit()

    for trigger_data in DEFAULT_TRIGGERS:
        CatalogService.create_item(db, trigger_data)

    for action_data in DEFAULT_ACTIONS:
        CatalogService.create_item(db, action_data)

    total_items = len(DEFAULT_TRIGGERS) + len(DEFAULT_ACTIONS)
    print(f"Successfully seeded {total_items} catalog items ({len(DEFAULT_TRIGGERS)} triggers, {len(DEFAULT_ACTIONS)} actions)")
