import React, { useState, useRef, useEffect } from 'react';
import { useField } from '@rocketseat/unform';
import api from '~/services/api';
import logo from '~/assets/Logo_File.png';

import { Container } from './styles';

export default function FileInput() {
  const ref = useRef();
  const { defaultValue, registerField } = useField('File');

  const [file, setFile] = useState(defaultValue && defaultValue.id);
  const [preview, setPreview] = useState(defaultValue && defaultValue.url);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    registerField({
      name: 'file_id',
      ref: ref.current,
      path: 'dataset.file',
    });
  }, [ref]); // eslint-disable-line

  async function handleChange(e) {
    const data = new FormData();

    data.append('file', e.target.files[0]);

    const response = await api.post('files', data);

    const { id, url } = response.data;

    setVisible(!visible);
    setFile(id);
    setPreview(url);
  }

  return (
    <Container>
      <label htmlFor="file_id">
        <img src={preview || logo} alt="banner" />
        <input
          type="file"
          id="file_id"
          accept="image/*"
          data-file={file}
          onChange={handleChange}
          ref={ref}
        />
      </label>
    </Container>
  );
}
