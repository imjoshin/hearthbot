import { Database } from "../db/Database"
import { CardTranslation, CardTranslationConstructor } from "../model/CardTranslation"

export class CardTranslationRepository {
  constructor(private db: Database) {}

  public getCardTranslations = async (cardId: string): Promise<CardTranslation[]> => {
    const dbResult = await this.db.run<CardTranslationConstructor>(`SELECT * FROM cardTranslation WHERE cardId = ?`, [cardId])

    return dbResult.map(row => new CardTranslation(row))
  }

  public upsertCardTranslation = async (cardTranslation: CardTranslation) => {
    const search = cardTranslation.name.replace(/[^\w]/g, ``).toLowerCase()

    const query = `
    INSERT INTO cardTranslation 
    (cardId, locale, name, search, flavor, \`text\`) 
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    name = ?,
    search = ?,
    flavor = ?,
    text = ?
    `
    await this.db.run(query, [cardTranslation.cardId, cardTranslation.locale, cardTranslation.name, search, cardTranslation.flavor, cardTranslation.text, cardTranslation.name, search, cardTranslation.flavor, cardTranslation.text])
  }
}