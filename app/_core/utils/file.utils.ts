import * as multer from 'multer'
import { Multer } from 'multer'
import * as path from 'path'
import * as fs from 'fs'

export const removeFile = (file: string) => {
  if (file == null || !file.length) return

  const filePath = __dirname + `/../../static/upload/${file}`

  fs.open(filePath, 'r', (err, fd) => {
    if (err) return
    fs.unlinkSync(filePath)
  })
}

export const uploadFile = (destination: string): Multer => {
  const storage = multer.diskStorage({
    destination: __dirname + `/../../static/upload/${destination}`,
    filename(
      _,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void
    ) {
      const filename = Date.now() + '-' + file.originalname
      callback(null, filename)
    }
  })

  return multer({
    storage,
    fileFilter(_, file: Express.Multer.File, callback: multer.FileFilterCallback) {
      if (file == undefined) return callback(null, false)
      const allowedExtensions: string[] = ['.jpg', '.JPG', '.png', '.jpeg', '.pdf', '.svg']
      if (!allowedExtensions.includes(path.extname(file.originalname))) {
        return callback(new Error('File not allowed'))
      }
      callback(null, true)
    }
  })
}
