import { $axios } from '@nuxtjs/axios';

class MyCustomUploadAdapterPlugin {
  constructor (loader, uploadUrl) {
    // The file loader instance to use during the upload process.
    this.loader = loader
    // The URL where to send the image data.
    this.uploadUrl = uploadUrl
  }

  // Starts the upload process.
  upload () {
    return new Promise((resolve, reject) => {
      this._initListeners(resolve, reject)
      this._sendRequest() // Call _sendRequest method
    })
  }

  // Aborts the upload process.
  abort () {
    // Not implemented for Axios requests
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners (resolve, reject) {
    const loader = this.loader

    loader.uploadTotal = this.loader.file.size
    loader.uploaded = 0

    const config = {
      onUploadProgress: (progressEvent) => {
        loader.uploaded = progressEvent.loaded
      }
    }
    $axios.post(this.uploadUrl, this._prepareFormData(), config)
      .then((response) => {
        if (response.data && response.data.url) {
          resolve({
            default: response.data.url
          })
        } else {
          reject('Invalid response from server')
        }
      })
      .catch((error) => {
        reject(error.message || 'Upload failed')
      })
  }

  // Sends the request.
  _sendRequest () {
    // No need to implement for Axios requests
  }

  // Prepares FormData object for upload
  _prepareFormData () {
    const data = new FormData()
    data.append('upload', this.loader.file)
    return data
  }
}

export default MyCustomUploadAdapterPlugin
