'use client'

import { deleteFile, uploadFile } from '@/actions/oss'
import { updateUser } from '@/actions/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { App, Avatar, Spin, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import dayjs from 'dayjs'
import { useState } from 'react'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const genFileItem = (url: string): UploadFile => ({
  uid: Math.random().toString(36).slice(2, 8),
  name: 'avatar.jpeg',
  status: 'done',
  url
})

export default function AvatarForm(props: { url?: string | null }) {
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    return props.url ? [genFileItem(props.url)] : []
  })

  const uploadMutaion = useMutation({
    mutationFn: async (file: FileType) => {
      const formData = new FormData()

      const ext = file.name.split('.').pop()
      const filePath = `avatar/${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.${ext}`
      formData.append('path', filePath)
      formData.append('image', file)
      const res = await uploadFile(formData)

      if (res?.url) {
        await updateUser({ avatar: res.url })

        // 删除旧头像
        try {
          if (props.url) {
            await deleteFile(props.url)
          }
        } catch (error) {
          console.error('Delete old avatar failed', error)
        }
        return res.url
      }
    },
    onSuccess: (url) => {
      message.success('uploaded')
      queryClient.invalidateQueries({ queryKey: ['user'] })
      if (url) {
        setFileList([genFileItem(url)])
      }
    }
  })

  const uploadProps: UploadProps = {
    listType: 'picture-circle',
    showUploadList: false,
    maxCount: 1,
    accept: 'image/*',
    fileList,
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        message.error('Image must smaller than 1MB!')
      }

      setFileList([file])
      uploadMutaion.mutate(file)

      return false
    }
  }

  return (
    <section className="flex items-center justify-center">
      <Spin spinning={uploadMutaion.isPending}>
        <ImgCrop
          quality={0.8}
          rotationSlider
          showReset
          cropShape="round"
          showGrid
          resetText="Reset"
          modalTitle="Upload Avatar"
          cropperProps={{ cropSize: { width: 300, height: 300 }, restrictPosition: true }}
          minZoom={0.2}
        >
          <Upload {...uploadProps}>
            {fileList.length > 0
              ? fileList.map((f) => <Avatar alt="" key={f.uid} src={f.url} style={{ width: '100%', height: '100%' }} />)
              : 'avatar'}
          </Upload>
        </ImgCrop>
      </Spin>
    </section>
  )
}
