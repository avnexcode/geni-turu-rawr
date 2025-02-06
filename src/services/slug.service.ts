import { Injectable } from '@nestjs/common';

export interface SlugRepository {
  findSimilarSlugs(baseSlug: string, excludeId?: string): Promise<string[]>;
}

@Injectable()
export class SlugService {
  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
      .replace(/-+/g, '-');
  }

  async generateUniqueSlug(
    name: string,
    repository: SlugRepository,
    excludeId?: string,
  ): Promise<string> {
    const baseSlug = this.generateSlug(name);
    let finalSlug = baseSlug;

    const existingSlugs = await repository.findSimilarSlugs(
      baseSlug,
      excludeId,
    );

    if (existingSlugs.length > 0) {
      const slugNumbers = existingSlugs
        .map((slug) => {
          const match = slug.match(new RegExp(`^${baseSlug}-(\\d+)$`));
          return match ? parseInt(match[1]) : 1;
        })
        .filter((num) => num >= 1);

      if (slugNumbers.length > 0) {
        const nextNumber = Math.max(...slugNumbers) + 1;
        finalSlug = `${baseSlug}-${nextNumber}`;
      } else {
        finalSlug = `${baseSlug}-2`;
      }
    }

    return finalSlug;
  }
}
