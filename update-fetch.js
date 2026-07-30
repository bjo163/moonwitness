const fs = require('fs');
let code = fs.readFileSync('packages/moon-orm/src/base.ts', 'utf8');

const signatureFind = `    options?: { limit?: number; offset?: number; order?: string }`;
const signatureReplace = `    options?: { limit?: number; offset?: number; order?: string; asOf?: Date | string }`;
code = code.replace(signatureFind, signatureReplace);

const endFetchFind = `    return rows
  }`;
const endFetchReplace = `    // Temporal Time-Travel (asOf)
    if (options?.asOf && env.getModel) {
       const asOfDate = new Date(options.asOf)
       const FxMsg = env.getModel('fx.msg')
       const FxTrack = env.getModel('fx.track')
       if (FxMsg && FxTrack) {
          const rowIds = rows.map(r => r.id)
          if (rowIds.length > 0) {
             const msgs = await FxMsg.fetch(FxMsg, env, [
                ['resModel', '=', modelClass._name],
                ['resId', 'in', rowIds],
                ['createdAt', '>', asOfDate]
             ], undefined, { order: 'createdAt desc' })
             
             if (msgs.length > 0) {
                const msgIds = msgs.map(m => m.id)
                const tracks = await FxTrack.fetch(FxTrack, env, [['messageId', 'in', msgIds]])
                
                // Reverse apply changes
                for (const row of rows) {
                   const rowMsgs = msgs.filter(m => m.res_id === row.id || m.resId === row.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                   for (const msg of rowMsgs) {
                      const msgTracks = tracks.filter(t => t.message_id === msg.id || t.messageId === msg.id)
                      for (const t of msgTracks) {
                         const fName = t.fieldName || t.field_name
                         const oVal = t.oldValue || t.old_value
                         if (fName && oVal !== undefined && oVal !== null) {
                            row[fName] = oVal
                            const snake = fName.replace(/[A-Z]/g, letter => \`_\${letter.toLowerCase()}\`)
                            row[snake] = oVal
                         }
                      }
                   }
                }
             }
          }
       }
    }

    return rows
  }`;
code = code.replace(endFetchFind, endFetchReplace);

fs.writeFileSync('packages/moon-orm/src/base.ts', code);
console.log('fetch updated');
