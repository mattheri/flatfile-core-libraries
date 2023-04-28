import { Blueprint } from '@flatfile/api'
import { Client } from '@flatfile/listener'
import { RecordsUpdates } from '@flatfile/api'

export const config: {
  slug: string
  name: string
  blueprints: Blueprint[]
} = {
  slug: 'external-api-config',
  name: 'Editable Name',
  blueprints: [
    {
      slug: 'basic-config-local',
      name: 'external-api-blueprint',
      sheets: [
        {
          name: 'TestSheet',
          slug: 'TestSheet',
          fields: [
            {
              key: 'brewery-name',
              type: 'string',
              label: 'Brewery name'
            }
          ]
        }
      ]
    }
  ]
}

/**
 * Example Client that checks data against external api
 */
export const externalApiClient = Client.create((client) => {
  client.on(
    'records:*',
    // @ts-ignore
    { context: { sheetSlug: 'TestSheet' } },
    async (event) => {
      const { sheetId, versionId } = event.context
      // get records

      try {
        const {
          data: { records }
        } = await event.api.getRecords({
          sheetId,
          versionId
        })

        if (!records) return

        const breweries = await fetch(
          'https://api.openbrewerydb.org/breweries?by_city=denver'
        )
          .then((res) => {
            return res.json()
          })
          .then((data) => {
            return data
          })

        const recordsUpdates = records?.map((record: any) => {
          const breweryNameRecordValue = record.values['brewery-name'].value
          const matchingBrewery = breweries.find((brewery) => {
            return brewery.name === breweryNameRecordValue
          })
          if (matchingBrewery) {
            record.values['brewery-name'].value = 'Exists in DB'
          }

          return record
        })

        console.log('updates', { recordsUpdates })

        await event.api.updateRecords({
          sheetId,
          recordsUpdates: recordsUpdates as RecordsUpdates
        })
      } catch (e) {
        console.log(
          `Error updating records - Use console logs inside your events to further debug: ${e}`
        )
      }
    }
  )
})