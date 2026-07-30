import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialogueStore } from '../../store/dialogue.store';
import { EventBus } from '../../engine/core/EventBus';
import { Bot, User, HelpCircle } from 'lucide-react';

export function DialogueOverlay() {
  const { isOpen, currentNode, nextNode, closeDialogue } = useDialogueStore();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Handle typing animation
  useEffect(() => {
    if (!currentNode) return;
    
    let i = 0;
    setDisplayedText('');
    setIsTyping(true);

    const fullText = currentNode.text;
    const speed = 25; // ms per char

    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [currentNode]);

  if (!isOpen || !currentNode) return null;

  const handleSkipOrNext = () => {
    if (isTyping) {
      // Skip typing
      setDisplayedText(currentNode.text);
      setIsTyping(false);
    } else {
      // Progress dialogue if no choices are blocking
      if (!currentNode.choices || currentNode.choices.length === 0) {
        if (currentNode.endDialogue) {
          closeDialogue();
        } else if (currentNode.nextNodeId) {
          // Fire triggers for the NEXT node when progressing
          EventBus.emit('dialogue:process_triggers', useDialogueStore.getState().currentTree?.nodes[currentNode.nextNodeId]?.triggers);
          nextNode(currentNode.nextNodeId);
        } else {
          closeDialogue(); // fallback
        }
      }
    }
  };

  const handleChoice = (choice: any) => {
    // Process triggers associated with the choice
    if (choice.triggers) {
      EventBus.emit('dialogue:process_triggers', choice.triggers);
    }
    // And process triggers for the node we are transitioning to
    EventBus.emit('dialogue:process_triggers', useDialogueStore.getState().currentTree?.nodes[choice.nextNodeId]?.triggers);
    
    nextNode(choice.nextNodeId);
  };

  // Resolve Portrait Icon
  const renderIcon = () => {
    switch (currentNode.portraitIcon) {
      case 'Bot': return <Bot className="w-10 h-10 text-cyan-400" />;
      case 'User': return <User className="w-10 h-10 text-fuchsia-400" />;
      default: return <HelpCircle className="w-10 h-10 text-slate-400" />;
    }
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-end p-4 pb-8">
      {/* Invisible overlay to capture clicks for skip/next */}
      <div 
        className="absolute inset-0 pointer-events-auto" 
        onClick={handleSkipOrNext} 
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentNode.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="relative pointer-events-auto flex gap-4 bg-slate-900/95 border-2 border-cyan-800/60 p-4 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-md"
        >
          {/* Portrait Box */}
          <div className="w-16 h-16 shrink-0 bg-black border border-cyan-900 rounded-lg flex items-center justify-center">
            {renderIcon()}
          </div>

          {/* Text Area */}
          <div className="flex-1 flex flex-col min-h-[4rem]">
            <h3 className="font-mono font-bold text-cyan-400 text-sm mb-1 uppercase tracking-wider">
              {currentNode.speakerName}
            </h3>
            
            <p className="text-slate-200 text-sm leading-relaxed">
              {displayedText}
            </p>

            {/* Next Indicator */}
            {!isTyping && (!currentNode.choices || currentNode.choices.length === 0) && (
              <motion.div 
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="self-end mt-auto text-cyan-500 font-bold"
              >
                ▼
              </motion.div>
            )}

            {/* Choices */}
            {!isTyping && currentNode.choices && currentNode.choices.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {currentNode.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChoice(choice);
                    }}
                    className="w-full text-left p-3 rounded bg-slate-800/80 border border-slate-700 hover:border-cyan-500 hover:bg-cyan-900/30 transition-colors text-sm font-medium text-slate-200 hover:text-white"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
