import logger from './logger.utils'
import Response from './response.utils'

export const tryCatch = async (
  fn: (...args: unknown[]) => Promise<unknown>,
  value: string | number = '',
  caller: string = ''
): Promise<Response> => {
  return Promise.resolve(fn()).catch((e) => {
    logger.error(`${caller} - ${value} (${e.message})`)

    if (process.env.NODE_ENV === 'development') return new Response().addError('server', e.message)
    else return new Response().addError('server', 'Server error')
  })
}
