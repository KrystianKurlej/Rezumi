'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { PreviewSettings, setScale } from '@/lib/slices/previewSlice'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function PreviewScale() {
    const dispatch = useAppDispatch()
    const previewSettings = useAppSelector(state => state.preview)

    const handleScaleChange = (newScale: number) => {
      if (newScale < 0.5 || newScale > 2) return

      const updatedSettings: PreviewSettings = {
          ...previewSettings,
          scale: newScale,
      }
      dispatch(setScale(newScale))
    }

    const formatScale = (scale: number) => {
        return `${Math.round(scale * 100)}%`
    }

    return(
        <InputGroup className="w-max absolute bottom-4 right-4 z-10 shadow">
            <InputGroupAddon align="inline-start" className="border-r pr-1">
              <InputGroupButton
                variant="secondary"
                size="icon-xs"
                onClick={() => handleScaleChange(previewSettings.scale - 0.1)}
              >
                <i className="bi bi-dash-lg"></i>
              </InputGroupButton>
            </InputGroupAddon>
            <InputGroupAddon align="inline-start" className="cursor-default">
              <i className="bi bi-search"></i>
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              defaultValue={formatScale(previewSettings.scale)}
              value={formatScale(previewSettings.scale)}
              className="text-center w-14 cursor-default"
              readOnly
            />
            <InputGroupAddon align="inline-end" className="border-l pl-1">
              <InputGroupButton
                variant="secondary"
                size="icon-xs"
                onClick={() => handleScaleChange(previewSettings.scale + 0.1)}
              >
                <i className="bi bi-plus-lg"></i>
              </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    )
}