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
        item_type="Event"
    ),
    CatalogItemCreate(
        icon_key="clock",
        name="Jadwal SIX",
        description="Memicu otomatisasi berdasarkan kalender akademik atau jadwal perkuliahan.",
        category="trigger",
        item_type="Schedule"
    ),
    CatalogItemCreate(
        icon_key="zap",
        name="Permasalahan UKT",
        description="Berjalan ketika ada laporan kendala, penangguhan, atau keterlambatan pembayaran UKT.",
        category="trigger",
        item_type="Event"
    ),
    CatalogItemCreate(
        icon_key="refresh",
        name="Perubahan Jadwal Kelas",
        description="Terpicu otomatis saat dosen memindahkan jam atau ruang kelas perkuliahan.",
        category="trigger",
        item_type="Event"
    ),
    CatalogItemCreate(
        icon_key="users",
        name="Aktivitas Dosen",
        description="Mendeteksi perubahan status atau pembaruan materi yang dilakukan oleh dosen pengampu.",
        category="trigger",
        item_type="Event"
    ),
    CatalogItemCreate(
        icon_key="checkCircle",
        name="Pembukaan Absensi",
        description="Terpicu saat dosen membuka sesi presensi mandiri untuk kelas yang sedang berlangsung.",
        category="trigger",
        item_type="Event"
    ),
]

DEFAULT_ACTIONS = [
    CatalogItemCreate(
        icon_key="mail",
        name="Notifikasi ke Email",
        description="Mengirimkan pesan otomatis ke email std.stei.itb.ac.id mahasiswa atau dosen.",
        category="action",
        item_type="API"
    ),
    CatalogItemCreate(
        icon_key="msg",
        name="Notifikasi ke WhatsApp",
        description="Mengirimkan pesan instan atau pengingat jadwal melalui WhatsApp.",
        category="action",
        item_type="Webhook"
    ),
    CatalogItemCreate(
        icon_key="fileText",
        name="Generate PDF",
        description="Membuat dokumen PDF secara otomatis seperti transkrip akademik atau surat keterangan.",
        category="action",
        item_type="API"
    ),
    CatalogItemCreate(
        icon_key="edit",
        name="Resize Gambar",
        description="Menyesuaikan ukuran dan kompresi file gambar untuk keperluan pasfoto profil SIX.",
        category="action",
        item_type="API"
    ),
]

def seed_catalog_items(db: Session) -> None:
    # Seed the database with default catalog items (triggers and actions).
    # Only inserts data if the catalog is empty.

    # Check if catalog already has items
    db.query(CatalogItem).delete()
    db.commit()
    
    # Create all default triggers
    for trigger_data in DEFAULT_TRIGGERS:
        CatalogService.create_item(db, trigger_data)
    
    # Create all default actions
    for action_data in DEFAULT_ACTIONS:
        CatalogService.create_item(db, action_data)
    
    total_items = len(DEFAULT_TRIGGERS) + len(DEFAULT_ACTIONS)
    print(f"Successfully seeded {total_items} catalog items ({len(DEFAULT_TRIGGERS)} triggers, {len(DEFAULT_ACTIONS)} actions)")