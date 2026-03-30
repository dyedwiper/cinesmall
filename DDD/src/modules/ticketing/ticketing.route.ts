import { Hono } from 'hono'

const app = new Hono()

app.post('/saalplaene', (c) => {
    return c.text('Saalpläne erzeugt')
})

app.get('wochenplan', (c) => {
    return c.text('Liste der Vorstellungen')
})

app.get('saalplan/:id', (c) => {
    return c.text('Saalplan für Vorstellung' + c.req.param('id'))
})

app.patch('saalplan/:id', (c) => {
    return c.text('Sitzplatz in Saalplan reserviert')
})

export default app