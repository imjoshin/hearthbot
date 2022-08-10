import { Database } from "../db/Database"
import { CardTranslation, CardTranslationConstructor } from "../model/CardTranslation"

export class CardTranslationRepository {
  constructor(private db: Database) {}

  public getCardTranslations = async (cardId: string): Promise<CardTranslation[]> => {
    const dbResult = await this.db.run<CardTranslationConstructor>(`SELECT * FROM 'cardTranslations' WHERE cardId = ?`, [cardId])

    return dbResult.map(row => new CardTranslation(row))
  }

  public addCardTranslation = async (cardId: string, locale: string, name: string, flavor?: string, text?: string) => {
    const query = `INSERT INTO cardTranslation (cardId, locale, name, flavor, 'text') VALUES (?, ?, ?, ?)`
    await this.db.run(query, [cardId, locale, name, flavor, text])
  }
}