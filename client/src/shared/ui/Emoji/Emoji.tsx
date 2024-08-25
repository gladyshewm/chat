import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './Emoji.css';
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from 'emoji-picker-react';
import { FaceFrownIcon } from '@shared/assets';
import { DrawOutlineRect } from '@shared/ui';
import { EMOJI_CATEGORIES } from './constants/emojiCategories';
import { emojiTransition, emojiVariants } from './motion';

interface EmojiProps {
  onEmojiSelect: (emoji: string) => void;
}

const Emoji = ({ onEmojiSelect }: EmojiProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiContainerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    setShowEmojiPicker(true);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const emojiContainer = emojiContainerRef.current;
    const relatedTarget = e.relatedTarget;

    if (!emojiContainer?.contains(relatedTarget as Node)) {
      setShowEmojiPicker(false);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <div
      className="emoji-input-container"
      ref={emojiContainerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button type="button" className="emoji-button">
        <FaceFrownIcon />
      </button>
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            className="emoji-picker-container"
            variants={emojiVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={emojiTransition}
          >
            <DrawOutlineRect rx={'15px'}>
              <EmojiPicker
                className="emoji-picker"
                width={'20rem'}
                height={'20rem'}
                theme={Theme.DARK}
                lazyLoadEmojis
                searchDisabled
                // reactionsDefaultOpen
                emojiStyle={EmojiStyle.NATIVE}
                onEmojiClick={onEmojiClick}
                categories={EMOJI_CATEGORIES}
              />
            </DrawOutlineRect>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Emoji;
