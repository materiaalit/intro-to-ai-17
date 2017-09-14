package fi.helsinki.cs.travelplanner;

import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.Set;

public class TravelPlanner {

    /**
     * Implement breath-first search. Return the answer as a linked list
     * where the first node points to the goal and each node has a stop
     * and is linked to the previous node in the path.
     * The last node in the list is the starting stop and its previous node is null.
     *
     * You can get the neighboring stops by calling the getNeighbors()-method on a stop.
     *
     * @param start Code of the start stop
     * @param goal Code of the goal stop
     * @return A linked list of States from goal to start
     */
    public State search(Stop start, Stop goal) {
        State state = new State(start, null);
        Set<Stop> visited = new HashSet<>();
        ArrayDeque<State> nextStates = new ArrayDeque<>();
        
        nextStates.add(state);
        visited.add(start);

        while (!nextStates.isEmpty()) {
            State currentState = nextStates.pop();
            if (currentState.getStop().equals(goal)) {
                return currentState;
            }
            for (Stop neighbor : currentState.getStop().getNeighbors()) {
                if (visited.contains(neighbor)) {
                    continue;
                }
                visited.add(neighbor);
                nextStates.add(new State(neighbor, currentState));
            }
        }
        return state;
    }
}
