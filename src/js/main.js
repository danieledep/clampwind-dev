import Alpine from 'alpinejs'
import ResizeFrame from './resizeFrame.js'
import '/src/css/main.css'

// Import Prism.js for syntax highlighting
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'


Alpine.data('resizeFrame', ResizeFrame);

window.Alpine = Alpine

Alpine.start()

Prism.highlightAll()
