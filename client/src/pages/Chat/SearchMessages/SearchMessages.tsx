import React, { FC, SetStateAction } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './SearchMessages.css';
import DrawOutline from '../../../components/DrawOutline/DrawOutline/DrawOutline';
import SearchInput from '../../../components/inputs/SearchInput/SearchInput';
import DrawOutlineRect from '../../../components/DrawOutline/DrawOutlineRect/DrawOutlineRect';
import SearchIllustration from '../../../components/Sidebar/MessagesList/Search/SearchIllustration/SearchIllustration';
import {
  backButtonVariants,
  contentVariants,
  searchVariants,
} from '../../../motion';
import XmarkIcon from '../../../icons/XmarkIcon';

interface SearchMessagesProps {
  isSearch: boolean;
  setIsSearch: (value: SetStateAction<boolean>) => void;
}

const SearchMessages: FC<SearchMessagesProps> = ({ isSearch, setIsSearch }) => {
  return (
    <AnimatePresence>
      {isSearch && (
        <motion.div
          className="search-messages"
          variants={searchVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <DrawOutline
            className="search-messages__wrapper"
            orientation="vertical"
            position="left"
          >
            <DrawOutline orientation="horizontal" position="bottom">
              <motion.div
                className="search-messages__header"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                <DrawOutlineRect className="close-button-wrapper" rx={'50%'}>
                  <motion.div
                    key="closeButton"
                    className="close-button"
                    onClick={() => setIsSearch(false)}
                    variants={backButtonVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <XmarkIcon />
                  </motion.div>
                </DrawOutlineRect>
                <DrawOutlineRect className="search-input-wrapper" rx={20}>
                  <SearchInput />
                </DrawOutlineRect>
              </motion.div>
            </DrawOutline>
            <div className="search-messages__main">
              <div className="search-block">
                <SearchIllustration />
                <p>Поиск сообщений</p>
              </div>
            </div>
          </DrawOutline>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchMessages;
