import type { Knex } from "knex"

export async function up(db: Knex): Promise<void> {
  await db.raw(`ALTER TABLE "vx_user" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_user" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_user" ALTER COLUMN otp_expires TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_user" ALTER COLUMN deleted_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_node" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_node" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_node" ALTER COLUMN deleted_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_org" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_org" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_zone" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_zone" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_coin" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_coin" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_role" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "vx_role" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "mx_model" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "mx_model" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "mx_grant" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "mx_grant" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "mx_rule" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "mx_rule" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "ix_lang" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "ix_lang" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "ix_dict" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "ix_dict" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "fx_msg" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "fx_msg" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "fx_track" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "fx_track" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "mx_metric" ALTER COLUMN created_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "mx_metric" ALTER COLUMN updated_at TYPE timestamp`)
  await db.raw(`ALTER TABLE "mx_metric" ALTER COLUMN timestamp TYPE timestamp`)
  await db.raw(
    `ALTER TABLE "fx_session" ALTER COLUMN created_at TYPE timestamp`
  )
  await db.raw(
    `ALTER TABLE "fx_session" ALTER COLUMN updated_at TYPE timestamp`
  )
  await db.raw(
    `ALTER TABLE "fx_session" ALTER COLUMN connected_at TYPE timestamp`
  )
  await db.raw(
    `ALTER TABLE "fx_session" ALTER COLUMN disconnected_at TYPE timestamp`
  )
}

export async function down(db: Knex): Promise<void> {
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_user.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_user.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_user.otp_expires`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_user.deleted_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_node.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_node.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_node.deleted_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_org.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_org.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_zone.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_zone.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_coin.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_coin.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_role.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for vx_role.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for mx_model.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for mx_model.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for mx_grant.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for mx_grant.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for mx_rule.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for mx_rule.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for ix_lang.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for ix_lang.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for ix_dict.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for ix_dict.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for fx_msg.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for fx_msg.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for fx_track.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for fx_track.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for mx_metric.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for mx_metric.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for mx_metric.timestamp`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for fx_session.created_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for fx_session.updated_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for fx_session.connected_at`
  )
  await db.raw(
    `-- Manual intervention required to down-migrate column type alteration for fx_session.disconnected_at`
  )
}
