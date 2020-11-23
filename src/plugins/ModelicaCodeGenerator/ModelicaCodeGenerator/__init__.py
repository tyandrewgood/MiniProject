"""
This is where the implementation of the plugin code goes.
The ModelicaCodeGenerator-class is imported from both run_plugin.py and run_debug.py
"""
import sys
import logging

from webgme_bindings import PluginBase


# Setup a logger
logger = logging.getLogger('ModelicaCodeGenerator')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)  # By default it logs to stderr..
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


class ModelicaCodeGenerator(PluginBase):
    """
    def main(self):
      core = self.core
      logger = self.logger
      root_node = self.root_node

      active_node = self.active_node
      logger.info('ActiveNode at  "{0} has name {1}'.format(core.get_path(active_node), name))

      core.set_attribute(active_node, 'name', 'newName')

      commit_info = self.util.save(root_node, self.commit_hash, 'master', 'Python plugin updated the model')
      logger.info('committed :{0}'.format(commit_info))
    """

           
      active_node = self.active_node
      core = self.core
      logger = self.logger
      logger.debug('path: {0}'.format(core.get_path(active_node)))
      logger.info('name: {0}'.format(core.get_attribute(active_node, 'name')))
      logger.warn('pos : {0}'.format(core.get_registry(active_node, 'position')))
      logger.error('guid: {0}'.format(core.get_guid(active_node)))

        
      self.namespace = None
      META = self.META
      
      nodes = core.load_sub_tree(active_node)
      #logger.info(nodes)
      
      places = []
      transitions = []
      inPlaces = []
      outPlaces = []
      vals = {}
      
      inPlaceSet = []
      
      #Populate vals so every unique Id corresponds to there actual name
      for node in nodes:
        vals[core.get_path(node)] = core.get_attribute(node, 'name')
      
      
      connections = []
      
      for node in nodes:
        if core.is_type_of(node, META['Place']):
          #places_data = {'name':core.get_attribute(node, 'name')}
          #places.append(places_data)
          places.append(core.get_attribute(node, 'name'))
        elif core.is_type_of(node, META['Transition']):
          #transition_data = {'name':core.get_attribute(node, 'name')}
          #transitions.append(transition_data) 
          transitions.append(core.get_attribute(node, 'name'))
        elif core.is_type_of(node, META['InPlace']):
          srcID = core.get_pointer_path(node, 'src')
          src = vals.get(srcID)
          dstId = core.get_pointer_path(node, 'dst')
          dst = vals.get(dstId)
          inPlace_data = {'name': core.get_attribute(node, 'name'), 'src': src, 'dst': dst}
          inPlaces.append(inPlace_data)
          connections.append((src, dst))
        elif core.is_type_of(node, META['OutPlace']):
          srcID = core.get_pointer_path(node, 'src')
          src = vals.get(srcID)
          dstId = core.get_pointer_path(node, 'dst')
          dst = vals.get(dstId)
          outPlace_data = {'name': core.get_attribute(node, 'name'), 'src': src, 'dst': dst}
          outPlaces.append(outPlace_data)
          connections.append((src, dst))
    
      logger.info(connections)
      parts = []
      for place in places:
        parts.append(place)
      for transition in transitions:
        parts.append(transition)
      
      logger.info(parts)
        
      # We traverse through and check for any duplicates
      # We also know that every transition should have one in and one out, therefore we say they should be equal
      # We know any other case will result in not a state machine   
      def stateMachine(inPlaces, outPlaces, transitions):
        countIn = []
        for inPlace in inPlaces:
          srcIn = inPlace.get('src')
          dstIn = inPlace.get('dst')    
          if srcIn in transitions:
            if srcIn not in countIn:
              countIn.append(srcIn)
            else:
              return False
            
          if dstIn in transitions:
            if dstIn not in countIn:
              countIn.append(dstIn)
            else:
              return False
        countOut = []  
        for outPlace in outPlaces:
          srcOut = outPlace.get('src')
          dstOut = outPlace.get('dst')
          if srcOut in transitions:
            if srcOut not in countOut:
              countOut.append(srcOut)
            else:
              return False
          if dstOut in transitions:
            if dstOut not in countOut:
              countOut.append(dstOut)
            else:
              return False
    
        return countIn == countOut
        
      # We traverse through and check for any duplicates
      # We also know that every place should have one in and one out, therefore we say they should be equal
      # We know any other case will result in not a marked graph
      def markedGraph(inPlaces, outPlaces, transitions):
        countIn = []
        for inPlace in inPlaces:
          srcIn = inPlace.get('src')
          dstIn = inPlace.get('dst')        
          if srcIn in places:
            if srcIn not in countIn:
              countIn.append(srcIn)
            else:
              return False
            
          if dstIn in places:
            if dstIn not in countIn:
              countIn.append(dstIn)
            else:
              return False
        countOut = []  
        for outPlace in outPlaces:
          srcOut = outPlace.get('src')
          dstOut = outPlace.get('dst')
          if srcOut in places:
            if srcOut not in countOut:
              countOut.append(srcOut)
            else:
              return False
          if dstOut in places:
            if dstOut not in countOut:
              countOut.append(dstOut)
            else:
              return False
        
  
        return countIn == countOut
        #return True
        #return len(countIn) == len(countOut)
      
      
      # Free choice is defined as every transition having a unique set of inPlaces
      # We already went and gathered the list of InPlaces
      # Here we increment our count for each time in one is in our set
      # If the count is equal to the length of our set, then we know it must be unique
      def freeChoice(inPlaces):
        count = 0
        for inplace in inPlaces:
          for temp in inPlaces:
            if inplace == temp:
              count += 1
        return count == len(inPlaces)
      
      
      # The idea:
      # First identify that there is only one sink and one source, if this is not true, they can not all be connected or reachable
      # Once, we have only identiifed as source, traverse the network starting at the source
      # We then keep track of the visited items and if the sink is ever reached. 
      # The next step is checking if each item was in our visited list. If it is not, then we know it was not reachable, so we return False. 
      # The program will then return if the sink is found or not completing the check
      def workFlow(inPlaces, outPlaces, places, transitions, parts, connections):
        countIn = []
        for inPlace in inPlaces:
          srcIn = inPlace.get('src')
          dstIn = inPlace.get('dst')        
          if srcIn in places:
            if srcIn not in countIn:
              countIn.append(srcIn)
            
          if dstIn in places:
            if dstIn not in countIn:
              countIn.append(dstIn)

        countOut = []  
        for outPlace in outPlaces:
          srcOut = outPlace.get('src')
          dstOut = outPlace.get('dst')
          if srcOut in places:
            if srcOut not in countOut:
              countOut.append(srcOut)
  
          if dstOut in places:
            if dstOut not in countOut:
              countOut.append(dstOut)
  
        
        source = None
        sink = None
        sourceCount = 0
        sinkCount = 0
        for place in places:
          if place not in countOut and place in countIn:
            if sourceCount == 0:
              source = place
              sourceCount +=1
            else: 
              return False
          if place not in countIn and place in countOut:
            if sinkCount == 0:
              sink = place
              sinkCount +=1
            else:
              return False
              
        visitedCount = 0
        visited = []
        temp = []
        temp.append(source)
        visited.append(source)
        sinkVisted = False
        while visitedCount < len(parts):
          if len(temp) == 0:
            return False
          current = temp.pop()
          visitedCount += 1
          if current == sink:
            sinkVisited = True
          for link in connections:
              if link[0] == current:
                if link[1] not in visited:
                  visited.append(link[1])
                  temp.append(link[1])
                  
                  
        for spot in parts:
          if spot not in visited:
            return False
        
        
        return sinkVisited
        
      
      #logger.info(places)
      #logger.info(transitions)
      #logger.info(inPlaces)
      #logger.info(outPlaces)
      isStateMachine = stateMachine(inPlaces, outPlaces, transitions)
      isMarkedGraph = markedGraph(inPlaces, outPlaces, places)
      isFreeChoice = freeChoice(inPlaces)
      isWorkFlowNet = workFlow(inPlaces, outPlaces, places, transitions, parts, connections)
      logger.info(isStateMachine)
      logger.info(isMarkedGraph)
      logger.info(isFreeChoice)
      logger.info(isWorkFlowNet)

