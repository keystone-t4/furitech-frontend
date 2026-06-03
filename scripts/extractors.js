function extractMeta(src) {
  return {
    createdAt: src.createdAt,
    updatedAt: src.updatedAt,
    ...(src.publishedAt !== undefined && {
      publishedAt: src.publishedAt,
    }),
    ...(src.locale !== undefined && {
      locale: src.locale,
    }),
  }
}

function extractFormats(formats) {
  if (!formats || typeof formats !== 'object') {
    return null
  }

  return Object.fromEntries(
    Object.entries(formats).map(([key, value]) => [
      key,
      {
        ext: value.ext,
        url: value.url,
        hash: value.hash,
        mime: value.mime,
        name: value.name,
        path: value.path ?? null,
        size: value.size,
        width: value.width ?? null,
        height: value.height ?? null,
      },
    ]),
  )
}

function extractMedia(media) {
  if (!media) {
    return null
  }

  if (Array.isArray(media)) {
    media = media[0]
  }

  if (!media) {
    return null
  }

  return {
    id: media.id,
    name: media.name,

    alternativeText: media.alternativeText ?? null,
    caption: media.caption ?? null,

    width: media.width ?? null,
    height: media.height ?? null,

    formats: extractFormats(media.formats),

    hash: media.hash,
    ext: media.ext,
    mime: media.mime,
    size: media.size,

    url: media.url,

    previewUrl: media.previewUrl ?? null,
    provider: media.provider ?? null,
    provider_metadata: media.provider_metadata ?? null,

    ...extractMeta(media),
  }
}

function extractSeo(seo) {
  if (!seo) {
    return null
  }

  return {
    meta_title: seo.meta_title ?? null,
    meta_description: seo.meta_description ?? null,
    meta_keywords: seo.meta_keywords ?? null,
    og_title: seo.og_title ?? null,
    og_description: seo.og_description ?? null,
    og_image: extractMedia(seo.og_image),
  }
}

function extractBlock(block) {
  if (!block) return null

  switch (block.__component) {
    case 'blocks.text-content':
      return {
        __component: 'blocks.text-content',
        id: block.id,
        title: block.title ?? '',
        text_content: block.text_content ?? '',
        image: extractMedia(block.image),
      }

    case 'blocks.image-list-content':
      return {
        __component: 'blocks.image-list-content',
        id: block.id,
        title: block.title ?? '',
        items: Array.isArray(block.items)
          ? block.items.map((item) => ({
              id: item.id,
              title: item.title ?? '',
              text_content: item.text_content ?? '',
              image: extractMedia(item.image),
            }))
          : [],
      }

    case 'blocks.map-content':
      return {
        __component: 'blocks.map-content',
        id: block.id,
        title: block.title ?? '',
        text_content: block.text_content ?? '',
        map_url: block.map_url ?? '',
      }

    default:
      return null
  }
}

export function extractFooter(raw) {
  if (!raw) {
    throw new Error('extractFooter: no raw data')
  }

  return {
    id: raw.id,
    copyright: raw.copyright ?? '',
    ...extractMeta(raw),
  }
}

export function extractErrorPage(raw) {
  if (!raw) {
    throw new Error('extractErrorPage: no raw data')
  }

  return {
    id: raw.id,
    page_not_found_text: raw.page_not_found_text ?? null,
    main_page_button_text: raw.main_page_button_text ?? null,
    ...extractMeta(raw),
  }
}

export function extractHomePage(raw) {
  if (!raw) {
    throw new Error('extractHomePage: no raw data')
  }

  return {
    id: raw.id,

    title: raw.title ?? null,
    sub_title: raw.sub_title ?? null,

    hero_image: extractMedia(raw.hero_image),

    block: Array.isArray(raw.block) ? raw.block.map(extractBlock).filter(Boolean) : null,

    seo: extractSeo(raw.seo),

    ...extractMeta(raw),
  }
}
