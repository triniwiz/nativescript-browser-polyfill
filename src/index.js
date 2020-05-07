require('tns-core-modules/globals');
import { TNSXMLHttpRequest, FileReader, Blob } from 'nativescript-http-async';
import Document from './DOM/Document';
import './window';
import './resize';
import './process';
import {
  requestAnimationFrame,
  cancelAnimationFrame,
} from './raf/animation-frame';

global.document = global.document || new Document();
Object.defineProperty(global, 'XMLHttpRequest', {
  value: TNSXMLHttpRequest,
  configurable: true,
  writable: true,
});
Object.defineProperty(global, 'Blob', {
  value: Blob,
  configurable: true,
  writable: true,
});

Object.defineProperty(global, 'FileReader', {
  value: FileReader,
  configurable: true,
  writable: true,
});

if (!typeof global.requestAnimationFrame) {
  Object.defineProperty(global, 'requestAnimationFrame', {
    value: requestAnimationFrame,
    configurable: true,
    writable: true,
  });
}

if (!typeof global.cancelAnimationFrame) {
  Object.defineProperty(global, 'cancelAnimationFrame', {
    value: cancelAnimationFrame,
    configurable: true,
    writable: true,
  });
}
