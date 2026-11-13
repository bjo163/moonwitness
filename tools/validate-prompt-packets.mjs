#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const packetDir = path.join(root, "JUST-PROMT-DONT-READ")
const failures = []
const packetFiles = fs.existsSync(packetDir)
  ? fs.readdirSync(packetDir).filter((name) => name.endsWith(".json"))
  : []
for (const file of packetFiles) {
  const filePath = path.join(packetDir, file)
  let packet
  try { packet = JSON.parse(fs.readFileSync(filePath, "utf8")) } catch (error) { failures.push(`${file}: invalid JSON (${error.message})`); continue }
  for (const field of ["packet_type", "packet_id", "status"]) if (!packet[field]) failures.push(`${file}: missing ${field}`)
  if (!/^(brainstorm_packet|feature_packet|audit_packet)$/.test(packet.packet_type ?? "")) failures.push(`${file}: invalid packet_type`)
  if (!/^(IDEA|PROPOSED|APPROVED|IN_PROGRESS|VERIFYING|COMPLETED|LOCKED|REJECTED)$/.test(packet.status ?? "")) failures.push(`${file}: invalid status`)
  if (packet.status === "APPROVED") {
    const approval = packet.approval
    if (!approval || approval.status !== "APPROVED" || !approval.approved_by || !approval.approved_at || !approval.approved_feature_id) failures.push(`${file}: approved packet lacks complete approval record`)
  }
  const projects = new Set((packet.projects ?? []).map((item) => item.code))
  const milestones = new Set((packet.milestones ?? []).map((item) => item.code))
  for (const milestone of packet.milestones ?? []) if (!projects.has(milestone.project_code)) failures.push(`${file}: milestone ${milestone.code} has no project parent`)
  for (const todo of packet.todos ?? []) {
    if (!projects.has(todo.project_code) || !milestones.has(todo.milestone_code)) failures.push(`${file}: todo ${todo.code} has invalid parent`)
    for (const field of ["actor_id", "skill_name", "target_file", "action_type", "evidence_required"]) if (!todo[field]) failures.push(`${file}: todo ${todo.code} missing ${field}`)
  }
}
const result = { schema_version: 1, packet_directory: path.relative(root, packetDir).replaceAll(path.sep, "/"), failures }
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
if (failures.length) process.exitCode = 2
